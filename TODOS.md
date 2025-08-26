# TODOS

* Record my notes from ChatGPT and organize them into a step-by-step software development plan and record those steps in the `SOFTWARE_DEVELOPMENT_PLAN.md` file.
* The code in `src/demo-project-mojo` directory should probably be moved either to the client app that I will use to test the database or to other directories within the database code.
* I don't like how Mojo (and Python) handle file imports (e.g. relative imports do not exist in Mojo). However, I probably need to rethink how I organize a projects when using Mojo. I think everything is supposed to run through the root `main.mojo` file and all code and imports should go through that file.
* I need to get used to recompiling the Mojo database code that will run inside of the Python server. I am not used to compiling/building code after I make changes because I have always used interpreted languages that use some form of automated server reloading or hot reloading, but I have never tried to work on a system's project with a compiled language. I will automate the compilation process with Make commands in the Makefile to make the compilation process easier.


* Make the code more modular and based around the clauses. There are many clauses that I am not familiar with but that I would like to add into the schema validations (and other parts of the middleware) later. Maybe one way to make it easy to add code for different clauses would be to make the code more modular depending on the clause. For example, when parsing a query string, I am extracting clauses and converting them to `queryClauseObj`s. After the `queryClauseObj`s have been created, maybe the next step is to check the type of each `queryClauseObj` and run it through the necessary stages that apply to that `queryClauseObj`. When I want to add schema validations for a new `queryClauseObj`, then most of the code will probably already exist to validate the new clause against the schema and I will only need to add checks and validations for anything that is unique to the new clause.
* Add required and optional (with defaults) values. I could allow for required and optional values and I would reconstruct the query string and add any default values, as opposed to trying to inject default values into the existing query string. See my notes in the SCHEMA_DEFINITION_RULES.md file.
    * It looks like the only constraint that FalkorDB does not support (from Cypher: https://neo4j.com/docs/cypher-manual/current/constraints/) is the data type (i.e. property type) constraint. (And the key constraint, but I don't know if I really want that.) Maybe I could use the schema file to define the schema and then use those definitions to create/update/delete constraints on the database/graph. That way the schema file would provide a clear and declarative reference for the data structure of the database. Look at some of the other constraints that Postgres provides, which might be nice to include in Quigley: Postgres Constraints: https://www.postgresql.org/docs/current/ddl-constraints.html

    * Study Cypher Constraints: https://neo4j.com/docs/cypher-manual/current/constraints/. Find similar documentation for OpenCypher.
        * [The Complete Cypher Cheat Sheet](https://memgraph.com/blog/cypher-cheat-sheet)
        * FalkorDB supports some constraints: https://docs.falkordb.com/commands/graph.constraint-create.html#introduction-to-constraints.
    * Required fields are defined with the NOT NULL Constraint in Postgres
        * https://www.postgresql.org/docs/current/ddl-constraints.html#DDL-CONSTRAINTS-NOT-NULL, 
        * https://stackoverflow.com/questions/70324605/postgresql-how-to-make-values-obligatory-in-insert-querys
    * Default values in Postgres: https://www.postgresql.org/docs/current/ddl-default.html
        * If no default value is declared explicitly, the default value is the null value. This usually makes sense because a null value can be considered to represent unknown data.
    * GraphQL: Arguments can be either required or optional. When an argument is optional, we can define a default value.

* I need to work through some tutorials from Neo4j, Memgraph, etc. that use demo datasets (e.g. the movie dataset) to test multiple queries of varying complexity to make sure that my schema validations and hierarchical query results work properly. I could also work through Neo4j's [Cypher Manual](https://neo4j.com/docs/cypher-manual/current/introduction/) and test my code and ideas against the queries that are presented in there. Actually it would probably be better to work through an equivalent OpenCypher Manual (if one exists) because GQL is based on the OpenCypher version of Cypher where Neo4j's version can/will get updates that do not apply to OpenCypher.
  * I can look at this page https://neo4j.com/docs/getting-started/appendix/example-data/ and maybe even work through all of the pages starting here https://neo4j.com/docs/getting-started/
* Improve error messages.
* Once I package this up into an NPM package, get the package to read the config file in the project root.
  * [How do node_modules packages read config files in the project root?](https://stackoverflow.com/questions/56729491/how-do-node-modules-packages-read-config-files-in-the-project-root)
  * Look at [drizzle.config.ts](https://orm.drizzle.team/docs/drizzle-config-file) for config file ideas.
  * Possible packages that could help with this:
    * https://www.npmjs.com/package/lilconfig
    * https://www.npmjs.com/package/cosmiconfig
