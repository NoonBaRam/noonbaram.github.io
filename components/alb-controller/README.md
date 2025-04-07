# 00. AWS OIDC 설정방법
https://noonbaram.notion.site/OIDC-c85ea8ef78ba47a1b008d5cf7b208bf5?pvs=4  

# 1. IAM Policy 다운 및 생성
## IAM Policy 다운
### 아래 명령어로 alb-controller-iam-policy.json 파일 다운
```bash
wget https://git.noonbaram.shop/components/alb-controller/alb-controller-iam-policy.json
```
alb-controller-iam-policy.json파일 내용 http://git.noonbaram.shop/components/alb-controller/alb-controller-iam-policy.json  

## IAM Policy 생성
```bash
aws iam create-policy --policy-name AWSLoadBalancerControllerIAMPolicy --policy-document file://alb-controller-iam-policy.json
```

# 2. Cert-manager 다운 및 생성
## cert-manager 다운
### 아래 명령어로 cert-manager.yaml 파일 다운
```bash
wget http://git.noonbaram.shop/components/alb-controller/cert-manager.yaml
```  
cert-manager.yaml파일 내용 http://git.noonbaram.shop/components/alb-controller/cert-manager.yaml  
## cert-manager 생성
```bash
kubectl apply --validate=false -f cert-manager.yaml
```
![image](https://github.com/user-attachments/assets/3c756950-143a-4ee8-b205-9e12ebe13a5c)  
```bash
kubectl get po -n cert-manager
```  
![image](https://github.com/NoonBaRam/noonbaram.github.io/assets/132915445/ce4a55e0-c160-44e1-b26e-63929648e726)  

# 3. alb-controller-v2.9.2 다운 및 수정 후 생성
## alb-controller 다운
### 아래 명령어로 alb-controller-v2.12.0.yaml 파일 다운
```bash
wget http://git.noonbaram.shop/components/alb-controller/alb-controller-v2.12.0.yaml
```  
alb-controller-v2.12.0.yaml파일 내용 http://git.noonbaram.shop/components/alb-controller/alb-controller-v2.12.0.yaml  
## YOUR-IAM-ROLE-ARN 수정
```bash
sed -i.bak -e 's|YOUR-IAM-ROLE-ARN|my-iam-arn|' ./alb-controller-v2.12.0.yaml
```  
![image](https://github.com/user-attachments/assets/7202a744-b80f-4692-b3f2-70e755fdc606)  

## YOUR-CLUSTER-NAME 수정
```bash
sed -i.bak -e 's|YOUR-CLUSTER-NAME|my-cluster|' ./alb-controller-v2.12.0.yaml
```  
![image](https://github.com/user-attachments/assets/7f7b5246-3eec-4c7e-9825-0d79104f611c)  

### <예시>
```bash
sed -i.bak -e 's|YOUR-CLUSTER-NAME|WTH-EKS|' ./alb-controller-v2.12.0.yaml
```  

## alb-controller-v2.12.0.yaml 생성
```bash
kubectl apply -f alb-controller-v2.12.0.yaml
```  
![image](https://github.com/user-attachments/assets/9e830216-0d55-454b-91df-6b1bfc9e4b55)  

# ingress-class 다운 및 생성

```bash
wget https://git.noonbaram.shop/components/alb-controller/ingclass.yaml && kubectl apply -f ingclass.yaml
```

✅ ingress class가 없으면 오류가 발생  

```html
Failed deploy model due to the server could not find the requested resource (post targetgroupbindings.elbv2.k8s.aws)
failed load groupID due to invalid ingress class: IngressClassParams.elbv2.k8s.aws "alb" not found
```  
그렇기에 ingressclass 를 다운 받아 apply하면 두가지 중 하나의 출력을 확인 할 수 있다.  
![image](https://github.com/NoonBaRam/noonbaram.github.io/assets/132915445/9c39d278-e5a3-4240-891d-2e5f39b5c8ab)  
ingressclass는 설치되어 있으므로 `unchanged`  
ingressclassparams는 없기에 `created` 로 나오거나   

![image](https://github.com/user-attachments/assets/a18647db-6ac2-43bd-9c37-db2f46575f4a)  
둘다 `created` 로 나옵니다.   

### 확인
```bash
kubectl logs -n kube-system aws-load-balancer-controller-5fd494fcdf-bgxwb
```  
![image](https://github.com/user-attachments/assets/34d143c4-ceb0-4df9-9fd2-5c96270b4fad)  
