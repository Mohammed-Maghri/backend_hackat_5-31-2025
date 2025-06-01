import { FastifyInstance } from "fastify";

type triple_val = string | number | boolean;

export interface Orm_insertion {
  server: FastifyInstance;
  table_name: string;
  colums_name: string[];
  colums_values: triple_val[];
  command_instraction: string | null;
}

export interface Orm_selection {
  server: FastifyInstance;
  table_name: string;
  colums_name: string[];
  command_instraction: string | null;
}
export interface update_data {
  server: FastifyInstance;
  table_name: string;
  colums_name: string[];
  colums_values: triple_val[];
  condition: string;
}
export interface deletion_data {
  server: FastifyInstance;
  table_name: string;
  condition: string;
}
export interface Orm {
  deletion: ({
    server,
    table_name,
    condition,
  }: deletion_data) => Promise<unknown>;
  update: ({
    server,
    colums_name,
    colums_values,
    condition,
    table_name,
  }: update_data) => Promise<unknown>;
  selection: ({
    server,
    table_name,
    colums_name,
    command_instraction,
  }: Orm_selection) => Promise<unknown>;
  insertion: ({
    server,
    table_name,
    colums_name,
    colums_values,
    command_instraction,
  }: Orm_insertion) => Promise<unknown> ;
}
