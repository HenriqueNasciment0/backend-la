import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class PinataService {
  private pinataApi = axios.create({
    baseURL: 'https://api.pinata.cloud/v3',
    headers: {
      Authorization: `Bearer ${process.env.PINATA_API_JWT}`,
      'Content-Type': 'application/json',
    },
  });

  async createGroup(name: string, isPublic = true) {
    try {
      const response = await this.pinataApi.post('/files/groups', {
        name,
        isPublic,
      });
      return response.data;
    } catch (error) {
      console.error(
        'Erro ao criar grupo:',
        error.response?.data || error.message,
      );
      throw error;
    }
  }

  async uploadFileToGroup(groupId: string, file: Express.Multer.File) {
    try {
      const formData = new FormData();
      formData.append(
        'file',
        new Blob([file.buffer], { type: file.mimetype }),
        file.originalname,
      );
      formData.append('group', groupId);

      const response = await this.pinataApi.post('/files', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      return {
        fileId: response.data.id,
        url: `https://gateway.pinata.cloud/ipfs/${response.data.ipfs_pin_hash}`,
      };
    } catch (error) {
      console.error(
        'Erro ao enviar arquivo para o grupo:',
        error.response?.data || error.message,
      );
      throw error;
    }
  }

  async addFileToGroup(groupId: string, fileId: string) {
    try {
      const response = await this.pinataApi.put(
        `/files/groups/${groupId}/ids/${fileId}`,
      );
      return response.data;
    } catch (error) {
      console.error(
        'Erro ao adicionar arquivo ao grupo:',
        error.response?.data || error.message,
      );
      throw error;
    }
  }

  async removeFileFromGroup(groupId: string, fileId: string) {
    try {
      const response = await this.pinataApi.delete(
        `/files/groups/${groupId}/ids/${fileId}`,
      );
      return response.data;
    } catch (error) {
      console.error(
        'Erro ao remover arquivo do grupo:',
        error.response?.data || error.message,
      );
      throw error;
    }
  }

  async getGroup(groupId: string) {
    try {
      const response = await this.pinataApi.get(`/files/groups/${groupId}`);
      return response.data;
    } catch (error) {
      console.error(
        'Erro ao obter detalhes do grupo:',
        error.response?.data || error.message,
      );
      throw error;
    }
  }

  async listGroups(filters = {}) {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const response = await this.pinataApi.get(
        `/files/groups${queryParams ? `?${queryParams}` : ''}`,
      );
      return response.data;
    } catch (error) {
      console.error(
        'Erro ao listar grupos:',
        error.response?.data || error.message,
      );
      throw error;
    }
  }

  async updateGroup(groupId: string, updates: any) {
    try {
      const response = await this.pinataApi.put(
        `/files/groups/${groupId}`,
        updates,
      );
      return response.data;
    } catch (error) {
      console.error(
        'Erro ao atualizar grupo:',
        error.response?.data || error.message,
      );
      throw error;
    }
  }
}
