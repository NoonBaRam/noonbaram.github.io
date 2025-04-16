#!/bin/bash
# eksctl 설치
mkdir $HOME/cli
wget --show-progress -q -P $HOME/cli/ https://github.com/eksctl-io/eksctl/releases/download/v0.194.0/eksctl_Linux_amd64.tar.gz
tar -zxf $HOME/cli/eksctl_Linux_amd64.tar.gz -C $HOME/cli/
sudo cp $HOME/cli/eksctl /usr/local/bin
eksctl completion bash >> $HOME/.bash_completion
source $HOME/.bash_completion
sleep 5
echo '~!~!~!~!~!~! eksctl 설치 완료 ~!~!~!~!~!~!'

# kubectl 설치
wget --show-progress -q -P $HOME/cli/ https://s3.us-west-2.amazonaws.com/amazon-eks/1.32.0/2024-12-20/bin/linux/amd64/kubectl
chmod +x $HOME/cli/kubectl
mkdir $HOME/bin && cp $HOME/cli/kubectl $HOME/bin/kubectl && export PATH=$HOME/bin:$PATH
echo 'source <(kubectl completion bash)' >>$HOME/.bashrc
echo 'alias k=kubectl' >>$HOME/.bashrc
echo 'complete -o default -F __start_kubectl k' >>$HOME/.bashrc
source $HOME/.bashrc
echo '~!~!~!~!~!~! kubectl 설치 완료 ~!~!~!~!~!~!'

# terraform 설치
sudo yum-config-manager --add-repo https://rpm.releases.hashicorp.com/AmazonLinux/hashicorp.repo
sudo yum -y install terraform
terraform -install-autocomplete
echo '~!~!~!~!~!~! terraform 설치 완료 ~!~!~!~!~!~!'

# docker 설치
sudo yum install -y docker
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -a -G docker ec2-user
wget --show-progress -q -P $HOME/cli/ https://raw.githubusercontent.com/docker/cli/refs/heads/master/contrib/completion/bash/docker
sudo cp $HOME/cli/docker /etc/bash_completion.d/docker
source /etc/bash_completion.d/docker
echo '~!~!~!~!~!~! docker 설치 완료 ~!~!~!~!~!~!'

# helm 설치
wget --show-progress -q -O $HOME/cli/get_helm.sh https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3
chmod 700 $HOME/cli/get_helm.sh
$HOME/cli/get_helm.sh
echo 'source <(helm completion bash)' >> ~/.bashrc
echo '~!~!~!~!~!~! helm 설치 완료 ~!~!~!~!~!~!'
echo 'eksctl, kubectl, terraform, docker, helm CLI 설치 완료 됐어요.'

# ArgoCD CLI 설치
wget --show-progress -q -O /home/ec2-user/cli/argocd-linux-amd64 https://github.com/argoproj/argo-cd/releases/latest/download/argocd-linux-amd64
sudo install -m 555 /home/ec2-user/cli/argocd-linux-amd64 /usr/local/bin/argocd
argocd completion bash > argocd_bash_completion
sudo mv argocd_bash_completion /etc/bash_completion.d/
echo 'ArgoCD CLI 설치 완료'  
echo 'EC2 SSH 재 접속 하세요'  
