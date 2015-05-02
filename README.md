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

