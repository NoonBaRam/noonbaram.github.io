# IAM Policy 다운
curl -O https://raw.githubusercontent.com/NoonBaRam/yaml/main/alb-controller/alb-controller-iam-policy.json
## IAM Policy 생성
aws iam create-policy --policy-name AWSLoadBalancerControllerIAMPolicy --policy-document file://alb-controller-iam-policy.json



# alb-controller-sa 다운 후 IAM Role arn 수정
curl -O https://raw.githubusercontent.com/NoonBaRam/yaml/main/alb-controller-sa.yaml
## alb-controller-sa 생성 
kubectl apply -f alb-controller-sa.yaml



# Cert-manager 다운
wget https://raw.githubusercontent.com/NoonBaRam/yaml/main/alb-controller/cert-manager.yaml
## cert-manager 생성
kubectl apply -f cert-manager.yaml



# alb-controller-v2.8 다운
wget https://raw.githubusercontent.com/NoonBaRam/yaml/main/alb-controller/alb-controller-v2.8.yaml
## yaml파일에 있는 SA 내용 삭제
sed -i.bak -e '627,635d' ./alb-controller-v2.8.yaml

![alb](https://github.com/NoonBaRam/yaml/assets/132915445/2792d3d6-005d-480c-94f7-0dbbb539313d)
## alb-controller-v2.8.yaml 생성
kubectl apply -f alb-controller-v2.8.yaml