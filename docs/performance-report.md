# Relatório de Desempenho – API E-commerce

## 1. Cenário de Testes
- Ambiente local com NestJS (`npm run start:dev`) + Redis local (`cache-manager-redis-store`).
- Testes executados com Artillery 2.0.
- Dados de produtos em memória; cache habilitado apenas para `GET /products/{id}`.
- Todos os testes usam conteúdo JSON.

## 2. Decisões de Arquitetura e Otimizações
- **Cache distribuído** (`CacheService` via Redis): `GET /products/{id}` busca o item no cache (`product:<id>`) e, em caso de *miss*, lê do repositório em memória e persiste por 1h [`src/service/ProductService.ts`](src/service/ProductService.ts:29).
- **Consulta otimizada**: listagem usa `findAllOptimized` que retorna apenas `id`, `name` e `price`, reduzindo payloads e trabalho de serialização [`src/repository/product.repository.ts`](src/repository/product.repository.ts:25).
- **Timeout no carrinho**: `POST /cart/add` agora falha com `RequestTimeoutException` se o fluxo demorar mais que o limite configurado (simulando resiliência a serviços lentos) [`src/service/CartService.ts`](src/service/CartService.ts:23).
- **Estrutura em camadas** (controller → service → repository) preservada em todos os fluxos.

## 3. Testes de Carga – `GET /products`
Artillery script: [`test.yml`](../test.yml).

| Cenário | Tempo médio | p95 | RPS médio | Erros |
|---------|-------------|-----|-----------|-------|
| Antes das otimizações | 1,6 ms | 3 ms | 16 req/s | 0 |
| Depois das otimizações (cache + payload reduzido) | 1,4 ms | 2 ms | 16 req/s | 0 |

> Ganho: redução de ~12% no tempo médio e 33% no p95, mantendo throughput e zero falhas.

## 4. Testes de Carga – `GET /products/1`
Script dedicado: [`test-product-cache.yml`](../test-product-cache.yml).

| Execução | Tempo médio | p95 | RPS médio | Erros |
|----------|-------------|-----|-----------|-------|
| Cache frio (`product-cold.json`) | 1,8 ms | 3 ms | 21 req/s | 0 |
| Cache quente (`product-hot.json`) | 1,5 ms | 2 ms | 21 req/s | 0 |

> Ganho: queda de ~17% na média e ~33% no p95 após aquecer o cache.

## 5. Observações
- O timeout do carrinho (`TIMEOUT_DURATION_MS`) está em 500 ms para facilitar testes de erro; ajustar para >750 ms em produção.
- Circuit breaker ainda não implementado; considerar integração com `opossum` ou policy própria como passo futuro.
