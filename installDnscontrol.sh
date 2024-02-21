# /bin/bash
# 检查当前操作系统架构
arch=$(uname -m)
if [ $arch != "aarch64" ] && [ $arch != "arm64" ]; then
    echo "当前操作系统不是ARM架构"
    wget https://github.com/StackExchange/dnscontrol/releases/download/v4.8.2/dnscontrol_4.8.2_linux_amd64.tar.gz -O dnscontrol.tar.gz
else
    echo "当前操作系统是ARM架构"
    wget https://github.com/StackExchange/dnscontrol/releases/download/v4.8.2/dnscontrol_4.8.2_linux_arm64.tar.gz -O dnscontrol.tar.gz
fi

tar -zxvf dnscontrol.tar.gz
mv dnscontrol /usr/bin/dnscontrol
chmod +x /usr/bin/dnscontrol