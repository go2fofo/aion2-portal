<!--
 * @Author: fofo
 * @Date: 2026-10-12 10:29:00
 * @LastEditTime: 2026-10-12 10:33:03
 * @LastEditors: fofo
 * @Description: 
 * @FilePath: /aion2-portal/关于部署vercel域名解析访问问题.md
-->
1.在 Vercel 中添加自定义域名：Vercel 控制台。进入你的 Vercel 项目页面 -> 点击 Settings -> Domains -> 输入你的阿里云域名（例如 app.yourdomain.com）并点击 Add。验证成功： Vercel 会给出你需要添加的 DNS 解析记录（通常是一条 CNAME 记录指向 cname.vercel-dns.com，或者 A 记录）。

2.在阿里云解析 DNS：阿里云控制台。登录阿里云控制台，进入 云解析 DNS，找到你的域名，添加 Vercel 要求的解析记录（例如添加一条主机记录为 app、记录类型为 CNAME、记录值为 cname.vercel-dns.com）。


原理是，反向代理，解析