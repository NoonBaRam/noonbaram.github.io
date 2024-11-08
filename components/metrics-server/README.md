# 1. metrics-server 다운
```bash
wget https://github.com/kubernetes-sigs/metrics-server/releases/download/v0.7.2/metrics-server-linux-amd64
```

# 2. metrics-server apply
```bash
k apply -f metrics-server-linux-amd64
```
#### 참고 URL : [metrics-server](https://github.com/kubernetes-sigs/metrics-server/releases)
#### metrics yaml 미리보기 : [metrics yaml](https://git.noonbaram.shop/components/metrics-server/metrics-server.yaml)
