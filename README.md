# Resumo
Para alterar o end point abra o arquivo 
scripts/service.js 

E procure por $http.get e mude o valor entre (), por exemplo:

```
$http.get('data/teste').success(function(data) { 
```

Ira ficar

```
$http.get('v1.0/data/teste2').success(function(data) { 
```




O formato do json esperado é:

```
{
  "senha" : valor
}
```

Para adicionar ao histórico, na proxima requisição o valor tem que ser diferente do valor anterior. (caso ele seja 404, "" ou igual, a lista não ira atualizar.)

Toda vez que a senha é atualizada a paginação volta para a pagina 1

# Armazenamento

As configurações são gravadas no localStorage do navegador, o tempo default é de 10 segundos para a busca de novas senhas e de 5 segundos para alteração de páginas.
