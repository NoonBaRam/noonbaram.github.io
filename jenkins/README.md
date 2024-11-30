# [ Jenkin helm values에 인증서 넣기 ]
## 1. values.yaml 수정
controller: 에 포함되어 있는 runAsUser: 1000 -> 0 변경  
readOnlyRootFilesystem: true -> false 변경  
![image](https://github.com/user-attachments/assets/a74ce7c2-86ec-4a4f-8a57-20eb7f1717e2)
![image](https://github.com/user-attachments/assets/89279cd3-5906-41ef-84fd-00432f60c9d4)  

# 2. lifecycle 사용
![image](https://github.com/user-attachments/assets/ea5e029c-92f2-4ef2-b32a-90e9fead977c)  
```yaml
# -- Lifecycle specification for controller-container
  lifecycle:
    postStart:
      exec:
        command:
        - "sh"
        - "-c"
        - |
          echo "crt import"
          keytool -importcert -file /tmp/wth/wth-root.crt -alias wth-root -keystore /opt/java/openjdk/lib/security/cacerts -storepass changeit -noprompt && \
          echo "certificate 복사 /etc/ssl/certs directory"
          cp /tmp/wth/wth-root.crt /etc/ssl/certs/
```

# 3. subPath로 configmap 마운트
![image](https://github.com/user-attachments/assets/6f3861d8-f106-4e9b-bdf2-dcc998628740)  

# 4. helm cli로 배포 후 pod 확인
```bash
helm upgrade -n jenkins jenkins jenkins/jenkins -f /home/ec2-user/yaml/jenkins/jenkins/dev-values.yaml
```  
![image](https://github.com/user-attachments/assets/57d77c7d-e345-4087-9250-3c60cb44c7ba)  
