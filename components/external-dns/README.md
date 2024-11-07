# helm repo 추가 및 template 다운
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
