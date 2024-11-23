***
# EXTERNAL DNS 구조
![image](https://github.com/user-attachments/assets/3b803a06-298f-43ce-9aac-b32ebdb50933)

***

# 1. helm repo 추가 및 template 다운
```bash
helm repo add external-dns https://kubernetes-sigs.github.io/external-dns/
```
```bash
helm repo update external-dns
```
```bash
helm template external-dns-private external-dns/external-dns \
    --namespace external-dns \
    --set image.tag=v0.15.0 \
    --set serviceAccount.create=false \
    --set serviceAccount.name=external-dns \
    --set interval=10s \
    --set policy=sync \
    --set registry=txt \
    --set txtOwnerId=HostingID \
    --set domainFilters[0]=test.dns.local \
    --set provider=aws \
    --set extraArgs[0]="--aws-zone-type=private" \
    --set extraArgs[1]="--ingress-class=alb" > external-dns.yaml
```
#### deployment의 --set policy 종류 및 설명
```md
upsert-only : 레코드셋 생성,업데이트 (삭제 불가능)
sync : 레코드셋 생성,업데이트,삭제
create-only: 레코드셋 생성 (삭제, 업데이트 불가능)
```  
#### HELM 배포 참고 URL : [external-dns-helm 배포](https://github.com/kubernetes-sigs/external-dns/tree/master/charts/external-dns)  
# 2. IAM Policy 생성
```json
{
    "Statement": [
        {
            "Action": [
                "route53:ChangeResourceRecordSets"
            ],
            "Effect": "Allow",
            "Resource": [
                "arn:aws:route53:::hostedzone/*"
            ]
        },
        {
            "Action": [
                "route53:ListHostedZones",
                "route53:ListResourceRecordSets",
                "route53:ListTagsForResource"
            ],
            "Effect": "Allow",
            "Resource": [
                "*"
            ]
        }
    ],
    "Version": "2012-10-17"
}
```
#### IAM Policy 참고 URL : [IAM POLICY](https://kubernetes-sigs.github.io/external-dns/v0.13.5/tutorials/aws/#iam-policy)  
## 2-1 EKS OIDC와 연결  
![image](https://github.com/user-attachments/assets/0d3c133b-db37-471d-bf8d-6ce26185b3f1)  



# 3. Namespace & ServiceAccount YAML 다운 및 IAM ROLE ARN수정
```bash
wget https://git.noonbaram.shop/components/external-dns/ns-serviceaccount.yaml
```
```yaml
# Namespace create
apiVersion: v1
kind: Namespace
metadata:
  name: external-dns
  annotations:
    kubectl.kubernetes.io/last-applied-configuration: '{"apiVersion":"v1","kind":"Namespace","metadata":{"name":"external-dns"}}'
spec: {}
---
# ServiceAccount Create
apiVersion: v1
kind: ServiceAccount
metadata:
  name: external-dns
  namespace: external-dns
  labels:
    app.kubernetes.io/name: external-dns
  annotations:
    eks.amazonaws.com/role-arn: YOUR-IAM-ROLE-ARN
```  
![image](https://github.com/user-attachments/assets/bc9a20f7-9cc1-4c7c-8bef-602e7f175cd5)  
# 4. ns-serviceaccount.yaml 배포
```
k apply -f ns-serviceaccount.yaml
```

# 5. external-dns.yaml 배포
```
k apply -f external-dns.yaml
```  
  
---  
  
# 6. 🧑🏼‍💻 external-dns 테스트
## 6-1 openssl cli로 인증서 생성
```bash
# private key 생성
openssl genrsa -out TEST-ACM.key 2048

# csr(Certificate Signing Request) 생성
openssl req -new -key TEST-ACM.key -out TEST-ACM.csr -subj "/C=US/ST=State/L=City/O=YourOrganization/OU=IT/CN=*.DNS-NAME"

# 인증서 본문 겸 체인 키 생성(1년 인증서)
openssl x509 -req -in TEST-ACM.csr -signkey TEST-ACM.key -out TEST-ACM.crt -days 365 -extfile <(printf "[v3_req]\nsubjectAltName=DNS:DNS-NAME,DNS:*.DNS-NAME") -extensions v3_req
```  
![image](https://github.com/user-attachments/assets/e873d46f-294a-4cb8-bd3d-1692abae2b94)  

#### 인증서 본문 : crt key
#### 인증서 프라이빗 키 : key
#### 인증서 체인 : crt key
![image](https://github.com/user-attachments/assets/60d55126-8f4f-457c-91d8-d199eda1ed0b)  

![image](https://github.com/user-attachments/assets/e8bb6c53-1c55-48e5-8d4f-dbb29eba5022)  

## 6-2 external-dns pod log 확인
![image](https://github.com/user-attachments/assets/7c1acc7a-7392-4625-aeff-e103284abdb6)  

## 6-3 ingress 배포
```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  annotations:
    #alb.ingress.kubernetes.io/listen-ports: '[{"HTTP":80}]'
    alb.ingress.kubernetes.io/listen-ports: '[{"HTTP":80}, {"HTTPS":443}]'
    alb.ingress.kubernetes.io/ssl-redirect: '443'
    alb.ingress.kubernetes.io/load-balancer-name: wth-dns-test-lb
    alb.ingress.kubernetes.io/manage-backend-security-group-rules: "true"
    alb.ingress.kubernetes.io/scheme: internal
    alb.ingress.kubernetes.io/ssl-policy: ELBSecurityPolicy-TLS13-1-2-2021-06
    alb.ingress.kubernetes.io/subnets: subnet-ID, subnet-ID
    alb.ingress.kubernetes.io/target-type: ip
    alb.ingress.kubernetes.io/certificate-arn: [생성한ACM ARN]
  name: dns-test
spec:
  ingressClassName: alb
  rules:
    - host: test.DNS-NAME
    - http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: testsvc
                port:
                  number: 80
```  

![image](https://github.com/user-attachments/assets/27e3fa34-92c2-4596-a7f0-cb5c1eeb9d83)  

### ingress 생성시 log  
### 이미지 클릭
[![create-image](https://github.com/user-attachments/assets/a35ad2d1-5b39-4539-a543-184d1bfda0b6)](https://git.noonbaram.shop/components/external-dns/externaldns-create.mp4)  

### ingress 삭제시 log
### 이미지 클릭
[![delete-image](https://github.com/user-attachments/assets/6bb50d5c-fe9f-4dee-b910-9a7884b2158f)](https://git.noonbaram.shop/components/external-dns/externaldns-ingress-delete.mp4)  
