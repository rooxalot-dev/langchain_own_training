 IA com foco em criação de gráficos personalizados para uma organizações:
Steps/Perguntas:
- Como obter os dados da organização?
    - Realizar a abordagem padrão dos RAGs e vetorizar uma base de conhecimento via embbedings?;
    - Converter linguagem natural para uma consulta direta a base de dados? (Obtendo um schema da base e estruturando o prompt);
- Com os dados, como gerar o gráfico?
    - Utilizar outra IA para a geração da imagem? (Pouco provavel no momento, uma vez que as imagens não são muito voltadas a gráficos e tm escritas falhas ainda);
    - Utilizar algum multi-agente que gere um código Python que com a entrada de dados obtida na fase anterior, plote os dados? (No momento é o que parece mais interessante);
- Uma vez tendo os dados, como avaliar se estão corretos?
    - Utilizar do próprio multi-agente para validar a veracidade dos dados e salvar os logs de acertos e erros;
    - Persistir essas iterações para reutilizar como histórico/contextualização de futuras interações?
        - Salvar esse histórico em uma base SQL normal ou vetorizada utilizando embbedings?


- Receber o input/query do usuário;
- Pesquisar em base vetorizada se há informação relevante para contextualização;
- Caso não haja documentos relevantes, realizar pesquisa na internet por conteúdo relevante;
- Salvar o conteúdo recuperado em base vetorizada;
- Retornar resposta;

---

Database used for testing (through docker compose): [https://github.com/pthom/northwind_psql]
