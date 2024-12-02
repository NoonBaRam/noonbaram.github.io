#!/bin/bash
# eksctl 설치
mkdir /home/ec2-user/cli
wget -P $HOME/cli/ https://github.com/eksctl-io/eksctl/releases/download/v0.194.0/eksctl_Linux_amd64.tar.gz
tar -zxf $HOME/cli/eksctl_Linux_amd64.tar.gz -C $HOME/cli/
sudo cp $HOME/cli/eksctl /usr/local/bin
eksctl completion bash >> $HOME/.bashrc-completion
source $HOME/.bashrc-completion

# kubectl 설치
wget -P $HOME/cli/  https://s3.us-west-2.amazonaws.com/amazon-eks/1.31.0/2024-09-12/bin/linux/amd64/kubectl
chmod +x $HOME/cli/kubectl
mkdir -p $HOME/bin && cp $HOME/cli/kubectl $HOME/bin/kubectl && export PATH=$HOME/bin:$PATH
echo 'source <(kubectl completion bash)' >>$HOME/.bashrc
echo 'alias k=kubectl' >>$HOME/.bashrc
echo 'complete -o default -F __start_kubectl k' >>$HOME/.bashrc
source $HOME/.bashrc

# terraform 설치
sudo yum-config-manager --add-repo https://rpm.releases.hashicorp.com/AmazonLinux/hashicorp.repo
sudo yum -y install terraform
terraform -install-autocomplete
echo terraform 설치 완료 했습니다. 명령어 자동 완성 하려면 ssh 재 접속하세요^_^

# docker 설치
sudo yum install -y docker
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -a -G docker ec2-user
wget -P $HOME/cli/ https://raw.githubusercontent.com/docker/cli/refs/heads/master/contrib/completion/bash/docker
sudo cp $HOME/cli/docker /etc/bash_completion.d/docker
source /etc/bash_completion.d/docker
echo ec2 server 재접속 하세요

# helm 설치
wget -O $HOME/cli/get_helm.sh https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3
chmod 700 $HOME/cli/get_helm.sh
$HOME/cli/get_helm.sh
echo 'source <(helm completion bash)' >> ~/.bashrc
echo 모든 CLI가 설치 됐습니다.
echo 서버를 재 접속 하세요~
