# 1. eni-config 배포  
```yaml
apiVersion: crd.k8s.amazonaws.com/v1alpha1
kind: ENIConfig
metadata:
 name: ap-northeast-2a
spec:
  subnet: <subnet ID>
---
apiVersion: crd.k8s.amazonaws.com/v1alpha1
kind: ENIConfig
metadata:
 name: ap-northeast-2c
spec:
  subnet: <subnet ID>
```
## 1-1 eni config 배포
```bash
k apply -f eni-config.yaml
```
## 1-2 VPC CNI 환경 변수 추가
```bash
kubectl set env ds -n kube-system aws-node AWS_VPC_K8S_CNI_CUSTOM_NETWORK_CFG=true
kubectl set env ds -n kube-system aws-node ENI_CONFIG_LABEL_DEF=topology.kubernetes.io/zone
kubectl set env ds -n kube-system aws-node ENABLE_PREFIX_DELEGATION=true

# CUSTOM_NETWORK_CFG  false -> true 변경
kubectl set env ds -n kube-system aws-node AWS_VPC_K8S_CNI_CUSTOM_NETWORK_CFG=true
# Labels 자동 매칭
kubectl set env ds -n kube-system aws-node ENI_CONFIG_LABEL_DEF=topology.kubernetes.io/zone
# max-pod 옵션 있는경우
kubectl set env ds -n kube-system aws-node ENABLE_PREFIX_DELEGATION=true
```  

## 1-2 확인  
```bash
kubectl describe ds -n kube-system aws-node | grep -i cfg
kubectl describe ds -n kube-system aws-node | grep -i def
kubectl describe ds -n kube-system aws-node | grep -i delegation
```  
![image](https://github.com/user-attachments/assets/2ee25e32-1303-4942-97df-5b83e589bb36)  
# 2. 노드 배포하여 pod IP 확인
![image](https://github.com/user-attachments/assets/de471b88-9548-49d1-91ac-70303dab935d)
