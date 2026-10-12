https://medium.com/hamburger-berater-team/fixing-503-errors-when-using-istio-envoy-bf63aa720826


# 1. Criar a ConfigMap com o Bootstrap do Envoy
kubectl apply -f envoy-configmap.yaml

# 2. Criar o Deployment unindo Envoy e Node.js
kubectl apply -f envoy-node-deployment.yaml
# 2.1 Em caso de ajustes, recriar os pods
kubectl rollout restart deployment/envoy-node-app

# 3. Validar o Roteamento via Envoy
kubectl run curl-test --image=curlimages/curl --rm -it --restart=Never -- curl -i http://envoy-service/

# 4. Copiar o arquivo de testes para o k8s
kubectl cp load-test.js k6-runner:/scripts/load-test.js

# 5. Rodar o teste
kubectl exec -it k6-runner -- k6 run /scripts/load-test.js

# 6. Teste com OHA
kubectl run oha-runner --image=ghcr.io/hatoo/oha --rm -it --restart=Never -- -c 100 -z 1m --burst-delay 5s --burst-rate 100 http://envoy-service/
kubectl run oha-runner --image=ghcr.io/hatoo/oha --rm -it --restart=Never -- -c 50 -z 30s http://envoy-service/






stream_idle_timeout  "Stream Idle Seconds" 60s
route.timeout    "Upstream Response Seconds" 15s
common_http_protocol_options.idle_timeout    "Upstream Connection Idle Seconds" 4s
clsuter.circuit_breakers.thresholds.max_connections
clsuter.circuit_breakers.thresholds.max_pending_requests
clsuter.circuit_breakers.thresholds.max_requests
clsuter.circuit_breakers.thresholds.max_retries
clsuter.circuit_breakers.thresholds.max_connection_pools