#!/bin/bash
usage = "\
install                                     安装/更新依赖\n\
dev 																	 	 client 开发模式\n\
node                                   		启动 Node 服务\n\"

install:
	yarn

dev: 
	cd ./packages/client && yarn serve

node: 
	cd ./packages/back/src && node index.js 
