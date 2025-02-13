# [ Jenkin helm values에 인증서 넣기 ]
## 1. values.yaml 수정
controller: 에 포함되어 있는 runAsUser: 1000 -> 0 변경  
readOnlyRootFilesystem: true -> false 변경  
![image](https://github.com/user-attachments/assets/a74ce7c2-86ec-4a4f-8a57-20eb7f1717e2)  
![image](https://github.com/user-attachments/assets/89279cd3-5906-41ef-84fd-00432f60c9d4)  

# 2. lifecycle 사용
![image](https://github.com/user-attachments/assets/7cddee69-0b0c-4670-822a-7d5f883e7a27)  
```yaml
# -- Lifecycle specification for controller-container
  lifecycle:
    postStart:
      exec:
        command:
        - "sh"
        - "-c"
        - |
          keytool -importcert -file /tmp/wth/wth-root.crt -alias wth-root -keystore /opt/java/openjdk/lib/security/cacerts -storepass changeit -noprompt && \
          cat /tmp/wth/jenkins-ca.crt >> /etc/ssl/certs/ca-certificates.crt
```

# 3. subPath로 configmap 마운트
![image](https://github.com/user-attachments/assets/6f3861d8-f106-4e9b-bdf2-dcc998628740)  

# 4. servicePort 변경 8080 -> 8081
![image](https://github.com/user-attachments/assets/de582713-76e3-44d0-80d6-72f58f4b0da0)  

# 5. ingress 생성
```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  annotations:
    alb.ingress.kubernetes.io/listen-ports: '[{"HTTP":80}, {"HTTPS":443}]'
    alb.ingress.kubernetes.io/ssl-redirect: '443'
    alb.ingress.kubernetes.io/load-balancer-name: 생성될 LB 이름
    alb.ingress.kubernetes.io/manage-backend-security-group-rules: "true"
    alb.ingress.kubernetes.io/scheme: internal
    alb.ingress.kubernetes.io/ssl-policy: ELBSecurityPolicy-TLS13-1-2-2021-06
    alb.ingress.kubernetes.io/subnets: subnet ID
    alb.ingress.kubernetes.io/target-type: ip
    alb.ingress.kubernetes.io/healthcheck-protocol: HTTP
    alb.ingress.kubernetes.io/healthcheck-path: /login # 작성 안하면 unhealth로 나옴
  name: jenkins
  namespace: jenkins
spec:
  ingressClassName: alb
  tls:
    - hosts:
        - jenkins.k8smaster.local
      secretName: jenkins-tls
  rules:
    - host: jenkins.k8smaster.local
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: jenkins
                port:
                  number: 8081 # 변경한 ServicePort
```  
# helm cli로 배포 후 pod 확인
```bash
# helm 배포 명령어
helm upgrade -n jenkins jenkins jenkins/jenkins -f /home/ec2-user/yaml/jenkins/jenkins/dev-values.yaml

# jenkins pod 접속 명령어
k exec -n jenkins jenkins-0 -it -- bash

# jenkins 접속 후 key import 됐는지 확인 명령어
keytool -list -keystore /opt/java/openjdk/lib/security/cacerts -storepass changeit -noprompt | grep wth
```  
![image](https://github.com/user-attachments/assets/c8878021-e6f4-492d-8f7f-4b0680ac90a9)  
![image](https://github.com/user-attachments/assets/56d9133a-2575-4a89-a77c-908dc3f5a916)  
![image](https://github.com/user-attachments/assets/8f7216bc-d1f1-4669-81a9-6411823f1309)  

## 윈도우 서버에서 jenkins 확인
![image](https://github.com/user-attachments/assets/cd715be5-4bdb-49db-8f13-3cbf88faefc9)  
