# AWS OIDC 설정방법
https://noonbaram.notion.site/OIDC-c85ea8ef78ba47a1b008d5cf7b208bf5?pvs=4  

# IAM Policy 다운 및 생성
## IAM Policy 다운
### 아래 명령어로 alb-controller-iam-policy.json 파일 다운
```bash
wget https://git.noonbaram.shop/alb-controller/alb-controller-iam-policy.json
```
#### 파일 내용
https://git.noonbaram.shop/alb-controller/alb-controller-iam-policy.json

## IAM Policy 생성
```bash
aws iam create-policy --policy-name AWSLoadBalancerControllerIAMPolicy --policy-document file://alb-controller-iam-policy.json
```

# alb-controller-sa 다운 및 파일 수정 후 생성
## 다운
`wget https://git.noonbaram.shop/alb-controller/alb-controller-sa.yaml`
## IAM Role arn 수정
`vi alb-controller-sa.yaml`
```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  labels:
    app.kubernetes.io/component: controller
    app.kubernetes.io/name: aws-load-balancer-controller
  name: aws-load-balancer-controller
  namespace: kube-system
  annotations:
    eks.amazonaws.com/role-arn: [IAM_Role_ARN]
```
## alb-controller-sa 생성 
`kubectl apply -f alb-controller-sa.yaml`


# Cert-manager 다운 및 생성
## cert-manager 다운
`wget https://git.noonbaram.shop/alb-controller/cert-manager.yaml`
## cert-manager 생성
`kubectl apply --validate=false -f cert-manager.yaml`

![image](https://github.com/NoonBaRam/noonbaram.github.io/assets/132915445/15d9407d-7360-4307-b427-ac0d75dd56e3)

`kubectl get po -n cert-manager`
![image](https://github.com/NoonBaRam/noonbaram.github.io/assets/132915445/ce4a55e0-c160-44e1-b26e-63929648e726)


# alb-controller-v2.8 다운 및 수정 후 생성
## 다운
`wget https://git.noonbaram.shop/alb-controller/alb-controller-v2.8.yaml`

## yaml파일에 있는 SA 내용 삭제
`sed -i.bak -e '627,635d' ./alb-controller-v2.8.yaml`

![alb](https://github.com/NoonBaRam/yaml/assets/132915445/2792d3d6-005d-480c-94f7-0dbbb539313d)

## your-cluster-name 수정
`sed -i.bak -e 's|your-cluster-name|my-cluster|' ./alb-controller-v2.8.yaml`
![image](https://github.com/NoonBaRam/yaml/assets/132915445/01541836-0db2-43d7-a4bc-46d162f25306)

### <예시>
`sed -i.bak -e 's|your-cluster-name|WTH-EKS|' ./alb-controller-v2.8.yaml`

## alb-controller-v2.8.yaml 생성
`kubectl apply -f alb-controller-v2.8.yaml`

# ingress-class 다운 및 생성
✅ 사실 ingress-class는 alb-controller-v2.8 생성하면서 생성이 되어 있다.  
그러나 간혹 발생하는 두가지 오류로 ingress가 정상적으로 배포가 되지 않는다
```html
Failed deploy model due to the server could not find the requested resource (post targetgroupbindings.elbv2.k8s.aws)
failed load groupID due to invalid ingress class: IngressClassParams.elbv2.k8s.aws "alb" not found
```
그렇기에 ingressclass 를 다운 받아 apply하면 두가지의 출력을 확인 할 수 있다.
![image](https://github.com/NoonBaRam/noonbaram.github.io/assets/132915445/9c39d278-e5a3-4240-891d-2e5f39b5c8ab)

ingressclass는 설치되어 있으므로 `unchanged`  
ingressclassparams는 없기에 `created` 로 나온다.  
ingress를 describe 했을때 위와 같은 오류가 나온다면 아래 명령어를 실행 하자  
배포 후 생성한 ingress를 describe 하여 확인한 결과  
![image](https://github.com/NoonBaRam/noonbaram.github.io/assets/132915445/8adb5cfa-5cdd-4456-8932-09196187927c)


## 다운
`wget https://git.noonbaram.shop/alb-controller/ingclass.yaml`

## 생성
`kubectl apply -f ingclass.yaml`

``
