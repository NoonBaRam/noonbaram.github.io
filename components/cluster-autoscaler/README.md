# 1. IAM Role & Policy 생성
## 1-1 IAM Policy 생성
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "autoscaling:DescribeAutoScalingGroups",
                "autoscaling:DescribeAutoScalingInstances",
                "autoscaling:DescribeLaunchConfigurations",
                "autoscaling:DescribeScalingActivities",
                "ec2:DescribeInstanceTypes",
                "ec2:DescribeLaunchTemplateVersions"
            ],
            "Resource": ["*"]
        },
        {
            "Effect": "Allow",
            "Action": [
                "autoscaling:SetDesiredCapacity",
                "autoscaling:TerminateInstanceInAutoScalingGroup"
            ],
            "Resource": ["*"]
        }
    ]
}
```
#### 참고 URL : [AWS_IAM_OIDC.md](https://github.com/kubernetes/autoscaler/blob/master/cluster-autoscaler/cloudprovider/aws/CA_with_AWS_IAM_OIDC.md)
#### 참고 Json : [IAM-POLICY](https://raw.githubusercontent.com/NoonBaRam/noonbaram.github.io/refs/heads/main/components/cluster-autoscaler/iam-policy.json)

## 1-2 EKS OIDC 연결하여 IAM Role 생성
![image](https://github.com/user-attachments/assets/6770e4d1-05a8-42fd-bde5-b0715ff6ab6c)  

# 2. Cluster Autoscaler yaml 다운  
```bash
wget https://git.noonbaram.shop/components/cluster-autoscaler/cluster-autoscaler.yaml
```

# 3. Yaml 수정

## 3-1 Service Account에 Annotations 추가 및 IAM Role ARN 입력  
![image](https://github.com/user-attachments/assets/12a4debb-cba9-4b2f-8f4a-7700df4e7f8a)  
```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  labels:
    k8s-addon: cluster-autoscaler.addons.k8s.io
    k8s-app: cluster-autoscaler
  annotations:
    eks.amazonaws.com/role-arn: YOUR-IAM-ROLE-ARN
  name: cluster-autoscaler
  namespace: kube-system
```
## 3-2 Image URI, Cluster Name 변경
![image](https://github.com/user-attachments/assets/e0526fb8-07c9-4ac2-83e3-f187e9551886)  

#### image의 맨뒤에 v1.xx.x 는 현재 사용하는 Cluster의 버전을 명시

## 3-3 Cluster Autoscaler 배포
```bash
k apply -f cluster-autoscaler-autodiscover.yaml
```
