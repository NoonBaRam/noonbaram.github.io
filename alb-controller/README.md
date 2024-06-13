# IAM Policy 다운 및 생성
## IAM Policy 다운
`wget https://raw.githubusercontent.com/NoonBaRam/yaml/main/alb-controller/alb-controller-iam-policy.json`
## IAM Policy 생성
`aws iam create-policy --policy-name AWSLoadBalancerControllerIAMPolicy --policy-document file://alb-controller-iam-policy.json`

# alb-controller-sa 다운 및 파일 수정 후 생성
## 다운
`wget https://raw.githubusercontent.com/NoonBaRam/yaml/main/alb-controller/alb-controller-sa.yaml`
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
`wget https://raw.githubusercontent.com/NoonBaRam/yaml/main/alb-controller/cert-manager.yaml`
## cert-manager 생성
`kubectl apply -f cert-manager.yaml`


# alb-controller-v2.8 다운 및 수정 후 생성
## 다운
`wget https://raw.githubusercontent.com/NoonBaRam/yaml/main/alb-controller/alb-controller-v2.8.yaml`

## yaml파일에 있는 SA 내용 삭제
`sed -i.bak -e '627,635d' ./alb-controller-v2.8.yaml`

![alb](https://github.com/NoonBaRam/yaml/assets/132915445/2792d3d6-005d-480c-94f7-0dbbb539313d)

## your-cluster-name 수정
![image](https://github.com/NoonBaRam/yaml/assets/132915445/01541836-0db2-43d7-a4bc-46d162f25306)

`sed -i.bak -e 's|your-cluster-name|my-cluster|' ./alb-controller-v2.8.yaml`

### <예시>

`sed -i.bak -e 's|your-cluster-name|WTH-EKS|' ./alb-controller-v2.8.yaml`


## alb-controller-v2.8.yaml 생성

`kubectl apply -f alb-controller-v2.8.yaml`

# ingress-class 다운 및 생성
## 다운
`wget https://raw.githubusercontent.com/NoonBaRam/noonbaram.github.io/main/alb-controller/v2_8_1_ingclass.yaml`

## 생성
`kubectl apply -f v2_8_1_ingclass.yaml`

``
