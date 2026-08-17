import { Client } from "@/domain/clients/entities/client";
import { ClientRepository } from "@/domain/clients/repositories/client-repository";
import { ConflictError } from "@/application/shared/errors/conflict-error";
import { supabase } from "../database/supabase";

export class SupabaseClientRepository implements ClientRepository {
    async create(client: Client): Promise<Client> {
        const { data, error } = await supabase.from("clients").insert({
            id: client.id,
            name: client.name,
            email: client.email,
            phone: client.phone,
            created_at: client.createdAt.toISOString(),
        }).select().single()

        if (error) {
            if (error.code === "23505") {
                throw new ConflictError("This phone number is already registered.");
            }
            throw new Error(`Failed to create client: ${error.message}`);
        }
        return new Client({
            id: data.id,
            name: data.name,
            email: data.email,
            phone: data.phone,
            createdAt: new Date(data.created_at)
        });
    }
    async findAll(): Promise<Client[]> {
        const { data, error } = await supabase
            .from("clients")
            .select("*");
        if (error) {
            throw new Error(`Failed to list clients: ${error.message}`)
        }
        return data.map((client) => {
            return new Client({
                id: client.id,
                name: client.name,
                email: client.email,
                phone: client.phone,
                createdAt: new Date(client.created_at),
            });
        });
    }
    async findById(id: string): Promise<Client | null> {
        const { data, error } = await supabase
            .from("clients")
            .select("*")
            .eq("id", id)
            .maybeSingle()

        if (error) {
            throw new Error(`Failed to find client: ${error.message}`);
        }

        if (!data) {
            return null;
        }

        return new Client(
            {
                id: data.id,
                name: data.name,
                email: data.email,
                phone: data.phone,
                createdAt: new Date(data.created_at),
            }
        )
    }

    async findByPhone(
        phone: string
    ): Promise<Client | null> {
        const { data, error } = await supabase
            .from("clients")
            .select("*")
            .eq("phone", phone)
            .maybeSingle();

        if (error) {
            throw new Error(
                `Failed to find client by phone: ${error.message}`
            );
        }

        if (!data) {
            return null;
        }

        return new Client({
            id: data.id,
            name: data.name,
            email: data.email,
            phone: data.phone,
            createdAt: new Date(data.created_at),
        });
    }

    async update(client: Client): Promise<Client> {
        const { data, error } = await supabase
            .from("clients")
            .update({
                name: client.name,
                email: client.email,
                phone: client.phone,
            })
            .eq("id", client.id)
            .select()
            .single();

        if (error) {
            if (error.code === "23505") {
                throw new ConflictError("This phone number is already registered.");
            }
            throw new Error(`Failed to update client: ${error.message}`);
        }
        return new Client({
            id: data.id,
            name: data.name,
            email: data.email,
            phone: data.phone,
        });
    }
    async delete(id: string): Promise<void> {
        const { error } = await supabase
            .from("clients")
            .delete()
            .eq("id", id)

        if (error) {
            throw new Error(`Failed to delete client: ${error.message}`);
        }
    }

}