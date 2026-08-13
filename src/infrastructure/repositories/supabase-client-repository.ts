import {Client} from "@/domain/clients/entities/client";
import {ClientRepository} from "@/domain/clients/repositories/client-repository";
import { supabase } from "../database/supabase";

export class SupabaseClientRepository implements ClientRepository {
    async create(client:Client): Promise<Client> {
        const {data, error} = await supabase.from("clients").insert({
            id: client.id,
            name: client.name,
            email: client.email,
            phone: client.phone,
            created_at: client.createdAt.toISOString(),
        }).select().single()

        if(error){
            throw new Error(` Erro ao criar cliente$:{error.menssage}`);
        }
        return new Client({
            id:data.id,
            name:data.name,
            email:data.email,
            phone:data.phone,
            createdAt: new Date(data.created_at) 
        });
    }
    async findAll(): Promise<Client[]> {
        throw new Error("Not implemented")   
    }
    async findById(id:string): Promise<Client|null>{
        throw new Error("Not implemented")
     }

    async update(client:Client): Promise<Client>{
        throw new Error("Not implemented")
    }
    async delete(id: string): Promise<void> {
        throw new Error("Not implemented")
    }
}