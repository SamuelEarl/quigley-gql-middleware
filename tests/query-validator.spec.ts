import { describe, expect, test } from "vitest";
import {
  findQueryObjSchema,
  validateQueryObjAgainstQueryObjSchema,
  checkForRequiredProp,
} from "../src/query-validator";
import { schema as validSchemaSyntax } from "./test-schema.valid-syntax";
import { INodeQueryObj, IRelationshipQueryObj } from "../src/types";

describe("query-validator.ts", () => {

  describe("findQueryObjSchema()", () => {
    test("A call to findQueryObjSchema with a 'Student' node query object should return the schema for a 'Student' node.", () => {
      // SETUP
      const studentNodeQueryObj: INodeQueryObj = {
        type: "node",
        label: "Student",
        alias: "s",
        props: {
          id: "1234",
          firstName: "John",
          lastName: "Doe",
          email: "john@example.com",
          age: 20,
          "address.street": "123 Main",
          "address.city": "Somewhere",
          "address.state": "AZ",
          "address.zip": "12345",
          roles: ["student"],
          classYear: "junior",
          misc: '{"accomodations":{"tests":"extra time"},"studentHousing":{"location":"none"}}',
        },
      };

      // EXECUTE
      const results = findQueryObjSchema(validSchemaSyntax, "label", studentNodeQueryObj.label);

      // VERIFY
      expect(results).toEqual(validSchemaSyntax.Student);

      // TEARDOWN

    });

    test("A call to findQueryObjSchema with a 'Movie' node query object should return null because a 'Movie' node is not defined in the schema.", () => {
      // SETUP
      const movieNodeQueryObj = {
        type: "node",
        label: "Movie",
        alias: "m",
        props: {},
      };

      // EXECUTE
      const results = findQueryObjSchema(validSchemaSyntax, "label", movieNodeQueryObj.label);

      // VERIFY
      expect(results).toEqual(null);
    });
  });

  describe("validateQueryObjAgainstQueryObjSchema()", () => {
    test("no schema errors should be thrown when called with a valid node query object", () => {
      // SETUP
      const studentNodeQueryObj: INodeQueryObj = {
        type: "node",
        label: "Student",
      };

      function invokeValidateQueryObjAgainstQueryObjSchema() {
        validateQueryObjAgainstQueryObjSchema("MATCH", validSchemaSyntax.Student, studentNodeQueryObj);
      }

      // EXECUTE and VERIFY
      expect(invokeValidateQueryObjAgainstQueryObjSchema).not.toThrow();
    });

    test("throw error when called with a node query object whose type is \"relationship\", which should not match any node schemas", () => {
      // SETUP
      const nodeQueryObj: INodeQueryObj = {
        type: "relationship",
        label: "Student",
        props: {},
      };

      function invokeValidateQueryObjAgainstQueryObjSchema() {
        const result = validateQueryObjAgainstQueryObjSchema("MATCH", validSchemaSyntax.Student, nodeQueryObj);
        throw new Error(result);
      }

      // EXECUTE and VERIFY
      expect(invokeValidateQueryObjAgainstQueryObjSchema).toThrowError(`There does not exist a "${nodeQueryObj.type}" in the schema with the label "${nodeQueryObj.label}". Check your query.`)
    });

    test("throw error when called with a relationship query object whose type is \"node\", which should not match any relationship schemas", () => {
      // SETUP
      const relationshipQueryObj: IRelationshipQueryObj = {
        type: "node",
        label: "ENROLLED_IN",
        props: {},
        from: null,
        to: null,
        direction: "bidirectional",
      };

      function invokeValidateQueryObjAgainstQueryObjSchema() {
        const result = validateQueryObjAgainstQueryObjSchema("MATCH", validSchemaSyntax.ENROLLED_IN, relationshipQueryObj);
        throw new Error(result);
      }

      // EXECUTE and VERIFY
      expect(invokeValidateQueryObjAgainstQueryObjSchema).toThrowError(`There does not exist a "${relationshipQueryObj.type}" in the schema with the label "${relationshipQueryObj.label}". Check your query.`)
    });

    test("throw error when called with a node query object whose label does not match any node schemas", () => {
      // SETUP
      const nodeQueryObj: INodeQueryObj = {
        type: "node",
        label: "Movie",
        props: {},
      };

      function invokeValidateQueryObjAgainstQueryObjSchema() {
        const result = validateQueryObjAgainstQueryObjSchema("MATCH", validSchemaSyntax.Student, nodeQueryObj);
        throw new Error(result);
      }

      // EXECUTE and VERIFY
      expect(invokeValidateQueryObjAgainstQueryObjSchema).toThrowError(`There does not exist a "${nodeQueryObj.type}" in the schema with the label "${nodeQueryObj.label}". Check your query.`)
    });

    test("throw error when called with a relationship query object whose label does not match any relationship schemas", () => {
      // SETUP
      const relationshipQueryObj: IRelationshipQueryObj = {
        type: "relationship",
        label: "ACTED_IN",
        props: {},
        from: null,
        to: null,
        direction: "bidirectional",
      };

      function invokeValidateQueryObjAgainstQueryObjSchema() {
        const result = validateQueryObjAgainstQueryObjSchema("MATCH", validSchemaSyntax.Student, relationshipQueryObj);
        throw new Error(result);
      }

      // EXECUTE and VERIFY
      expect(invokeValidateQueryObjAgainstQueryObjSchema).toThrowError(`There does not exist a "${relationshipQueryObj.type}" in the schema with the label "${relationshipQueryObj.label}". Check your query.`)
    });
  });

  describe("checkForRequiredProp()", () => {
    test("When all required query params are present, then no schema validation errors are thrown. When required query params are missing, then schema validation errors are thrown.", () => {
      // SETUP
      const requiredProp1 = "firstName";
      const requiredProp2 = "age";

      const queryObjProps = {
        id: "1234",
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        // age: 20, // In this example, the query params are missing an `age` param, which means that the queryObjProps will also be missing an `age` prop.
        "address.street": "123 Main",
        "address.city": "Somewhere",
        "address.state": "AZ",
        "address.zip": "12345",
        roles: ["student"],
        classYear: "junior",
        misc: '{"accomodations":{"tests":"extra time"},"studentHousing":{"location":"none"}}',
      }

      function invokeCheckForRequiredPropWithQueryParamPresent() {
        checkForRequiredProp(requiredProp1, queryObjProps);
      }

      function invokeCheckForRequiredPropWithQueryParamMissing() {
        checkForRequiredProp(requiredProp2, queryObjProps);
      }

      function invokeCheckForRequiredPropWithNoParamsObj() {
        checkForRequiredProp(requiredProp1);
      }

      function invokeCheckForRequiredPropWithEmptyParamsObj() {
        checkForRequiredProp(requiredProp1, {});
      }

      // EXECUTE and VERIFY
      const errorMsg1 = `All node properties are required in CREATE clauses. All relationship properties are required in MERGE clauses. The "${requiredProp1}" param is missing from the query.`;
      const errorMsg2 = `All node properties are required in CREATE clauses. All relationship properties are required in MERGE clauses. The "${requiredProp2}" param is missing from the query.`;

      expect(invokeCheckForRequiredPropWithQueryParamPresent).not.toThrow();
      expect(invokeCheckForRequiredPropWithQueryParamMissing).toThrowError(errorMsg2);
      expect(invokeCheckForRequiredPropWithNoParamsObj).toThrowError(errorMsg1);
      expect(invokeCheckForRequiredPropWithEmptyParamsObj).toThrowError(errorMsg1);
    });
  });
});
