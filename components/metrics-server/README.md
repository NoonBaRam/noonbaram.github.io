# 1. metrics-server 다운
```bash
wget https://github.com/kubernetes-sigs/metrics-server/releases/download/v0.7.2/components.yaml
```  

# 2. metrics-server apply
```bash
k apply -f components.yaml
```
# 3. 확인
```bash
kubectl top pod -A
# or
kubectl top node
```

![image](https://github.com/user-attachments/assets/49468d21-7c73-44fb-8abf-bb72f849fa43)  
![image](https://github.com/user-attachments/assets/3e9e1deb-ff9f-4a47-9047-8f26ba582be8)  

#### 참고 URL : [metrics-server](https://github.com/kubernetes-sigs/metrics-server/releases)
#### yaml 미리보기 : [metrics yaml](https://git.noonbaram.shop/components/metrics-server/metrics-server.yaml)
