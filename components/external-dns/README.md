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

# 2. Namespace & ServiceAccount YAML 다운 및 IAM ROLE ARN수정
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

# 3. ns-serviceaccount.yaml 배포
```
k apply -f ns-serviceaccount.yaml
```

# 4. external-dns.yaml 배포
```
k apply -f external-dns.yaml
```
