# 1. helm repo 추가 및 template 다운
```bash
helm repo add external-dns https://kubernetes-sigs.github.io/external-dns/
```
```bash
helm repo update external-dns
```
```bash
helm template external-dns-private external-dns/external-dns \
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
#### 참고 URL : [external-dns-helm 배포](https://github.com/kubernetes-sigs/external-dns/tree/master/charts/external-dns)  
# 2. IAM Policy 참고하여 IAM Role 생성
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
#### IAM Policy 참고 URL
https://kubernetes-sigs.github.io/external-dns/v0.13.5/tutorials/aws/#iam-policy  
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
# 6. external-dns 테스트
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






