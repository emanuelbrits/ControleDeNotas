import Fastify, { FastifyReply, FastifyRequest } from 'fastify';
import { PrismaClient } from '@prisma/client';
import formbody from '@fastify/formbody';
import cors from '@fastify/cors';

const fastify = Fastify({ logger: true });
const prisma = new PrismaClient();

fastify.register(formbody);

fastify.register(cors, {
    origin: '*', // Pode alterar para o domínio específico do seu frontend, por exemplo: 'http://localhost:3000'
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos HTTP permitidos
});

//ALUNO

// Create (POST)
fastify.post('/aluno', async (request, reply) => {
    const { nome, email } = request.body as { nome: string, email: string };
    try {
        const newAluno = await prisma.aluno.create({
            data: {
                nome,
                email,
            },
        });
        return newAluno;
    } catch (error) {
        console.error('Error creating aluno:', error);
        reply.status(500).send({ error: 'Failed to create aluno' });
    }
});

// Read All (GET)
fastify.get('/alunos', async (request, reply) => {
    try {
        const alunos = await prisma.aluno.findMany({ include: { disciplinas: true } });
        return alunos;
    } catch (error) {
        console.error('Error fetching alunos:', error);
        reply.status(500).send({ error: 'Failed to fetch alunos' });
    }
});

// Read One (GET)
fastify.get('/aluno/:id', async (request, reply) => {
    const id = parseInt(request.params.id);
    try {
        const aluno = await prisma.aluno.findUnique({
            where: { id },
            include: {
                disciplinas: {
                    include: {
                        boletins: {
                            where: {
                                alunoId: id // Pega o boletim apenas da disciplina específica
                            }
                        }
                    }
                }
            }
        });
        if (!aluno) {
            return reply.status(404).send({ error: 'Aluno not found' });
        }
        return aluno;
    } catch (error) {
        console.error('Error fetching aluno:', error);
        reply.status(500).send({ error: 'Failed to fetch aluno' });
    }
});

// Update (PUT)
fastify.put('/aluno/:id', async (request, reply) => {
    const id = parseInt(request.params.id);
    const { nome, email } = request.body as { nome: string, email: string };

    try {
        // Verifica se o ID é um número válido
        if (isNaN(id)) {
            return reply.status(400).send({ error: 'Invalid ID' });
        }

        // Atualiza o aluno no banco de dados
        const updatedAluno = await prisma.aluno.update({
            where: { id },
            data: { nome, email },
        });

        // Retorna o aluno atualizado
        return updatedAluno;
    } catch (error) {
        console.error('Error updating aluno:', error);
        // Verifica se o aluno existe e se foi encontrado
        if (error.code === 'P2025') {
            return reply.status(404).send({ error: 'Aluno not found' });
        }
        return reply.status(500).send({ error: 'Failed to update aluno' });
    }
});


// Delete (DELETE)
fastify.delete('/aluno/:id', async (request, reply) => {
    const id = parseInt(request.params.id);
    try {
        await prisma.aluno.delete({
            where: { id },
        });
        return reply.status(204).send(); // No content
    } catch (error) {
        console.error('Error deleting aluno:', error);
        reply.status(500).send({ error: 'Failed to delete aluno' });
    }
});

//PROFESSOR

// Create (POST)
fastify.post('/professor', async (request, reply) => {
    const { nome, email } = request.body as { nome: string, email: string };
    try {
        const newProfessor = await prisma.professor.create({
            data: {
                nome,
                email,
            },
        });
        return newProfessor;
    } catch (error) {
        console.error('Error creating professor:', error);
        reply.status(500).send({ error: 'Failed to create professor' });
    }
});

// Read All (GET)
fastify.get('/professores', async (request, reply) => {
    try {
        const professores = await prisma.professor.findMany({ include: { disciplinas: true } });
        return professores;
    } catch (error) {
        console.error('Error fetching professores:', error);
        reply.status(500).send({ error: 'Failed to fetch professores' });
    }
});

// Read One (GET)
fastify.get('/professor/:id', async (request, reply) => {
    const id = parseInt(request.params.id);
    try {
        const professor = await prisma.professor.findUnique({
            where: { id },
            include: { disciplinas: true }, // Incluindo disciplinas se necessário
        });
        if (!professor) {
            return reply.status(404).send({ error: 'Professor not found' });
        }
        return professor;
    } catch (error) {
        console.error('Error fetching professor:', error);
        reply.status(500).send({ error: 'Failed to fetch professor' });
    }
});

// Update (PUT)
fastify.put('/professor/:id', async (request, reply) => {
    const id = parseInt(request.params.id);
    const updates = request.body as Partial<{ nome: string, email: string }>;

    try {
        if (isNaN(id)) {
            return reply.status(400).send({ error: 'Invalid ID' });
        }

        const updatedProfessor = await prisma.professor.update({
            where: { id },
            data: updates,
        });

        return updatedProfessor;
    } catch (error) {
        console.error('Error updating professor:', error);
        if (error.code === 'P2025') {
            return reply.status(404).send({ error: 'Professor not found' });
        }
        return reply.status(500).send({ error: 'Failed to update professor' });
    }
});

// Delete (DELETE)
fastify.delete('/professor/:id', async (request, reply) => {
    const id = parseInt(request.params.id);
    try {
        await prisma.professor.delete({
            where: { id },
        });
        return reply.status(204).send(); // No content
    } catch (error) {
        console.error('Error deleting professor:', error);
        if (error.code === 'P2025') {
            return reply.status(404).send({ error: 'Professor not found' });
        }
        return reply.status(500).send({ error: 'Failed to delete professor' });
    }
});

// DISCIPLINA

// Create (POST)
fastify.post('/disciplina', async (request, reply) => {
    const { nome, professorId, alunos } = request.body as { nome: string, professorId: number, alunos?: number[] };

    try {
        const newDisciplina = await prisma.disciplina.create({
            data: {
                nome,
                professorId,
                alunos: {
                    connect: alunos?.map(alunoId => ({ id: alunoId })),
                },
            },
            include: {
                alunos: true, // Incluindo alunos na resposta
            },
        });
        return newDisciplina;
    } catch (error) {
        console.error('Error creating disciplina:', error);
        reply.status(500).send({ error: 'Failed to create disciplina' });
    }
});

// Read All (GET)
fastify.get('/disciplinas', async (request, reply) => {
    try {
        const disciplinas = await prisma.disciplina.findMany({
            include: {
                alunos: true, // Incluindo alunos na resposta
                professor: true, // Incluindo professor na resposta
            },
        });
        return disciplinas;
    } catch (error) {
        console.error('Error fetching disciplinas:', error);
        reply.status(500).send({ error: 'Failed to fetch disciplinas' });
    }
});

// Read One (GET)
fastify.get('/disciplina/:disciplinaId', async (request, reply) => {
    const disciplinaId = parseInt(request.params.disciplinaId);

    try {
        const disciplina = await prisma.disciplina.findUnique({
            where: { id: disciplinaId },
            include: {
                professor: true, // Para incluir os detalhes do professor
                alunos: {
                    include: {
                        boletins: {
                            where: {
                                disciplinaId: disciplinaId // Pega o boletim apenas da disciplina específica
                            }
                        }
                    }
                }
            }
        });

        if (!disciplina) {
            return reply.status(404).send({ error: 'Disciplina not found' });
        }

        return disciplina;
    } catch (error) {
        console.error('Error fetching disciplina details:', error);
        reply.status(500).send({ error: `Failed to fetch disciplina details: ${error.message}` });
    }
});


// Update (PUT)
fastify.put('/disciplina/:id', async (request, reply) => {
    const id = parseInt(request.params.id);
    const { nome, professorId, alunos } = request.body as { nome?: string, professorId?: number, alunos?: number[] };

    try {
        if (isNaN(id)) {
            return reply.status(400).send({ error: 'Invalid ID' });
        }

        const updatedDisciplina = await prisma.disciplina.update({
            where: { id },
            data: {
                nome,
                professorId,
                alunos: {
                    set: alunos?.map(alunoId => ({ id: alunoId })),
                },
            },
            include: {
                alunos: true, // Incluindo alunos na resposta
                professor: true, // Incluindo professor na resposta
            },
        });

        return updatedDisciplina;
    } catch (error) {
        console.error('Error updating disciplina:', error);
        if (error.code === 'P2025') {
            return reply.status(404).send({ error: 'Disciplina not found' });
        }
        return reply.status(500).send({ error: 'Failed to update disciplina' });
    }
});

// Add aluno na disciplina
fastify.post('/disciplina/:disciplinaId/alunos', async (request, reply) => {
    const disciplinaId = parseInt(request.params.disciplinaId);
    const { alunos }: { alunos: number[] } = request.body; // Recebe os IDs dos alunos pelo corpo da requisição

    try {
        if (isNaN(disciplinaId) || !Array.isArray(alunos)) {
            return reply.status(400).send({ error: 'Invalid ID or body format' });
        }

        // Verifica se a disciplina existe
        const disciplina = await prisma.disciplina.findUnique({
            where: { id: disciplinaId },
            include: { alunos: true } // Inclui os alunos atuais
        });

        if (!disciplina) {
            return reply.status(404).send({ error: 'Disciplina not found' });
        }

        // IDs dos alunos atuais na disciplina
        const alunosAtuaisIds = disciplina.alunos.map(aluno => aluno.id);

        // Determina quais alunos devem ser adicionados e removidos
        const alunosParaAdicionar = alunos.filter(alunoId => !alunosAtuaisIds.includes(alunoId));
        const alunosParaRemover = alunosAtuaisIds.filter(alunoId => !alunos.includes(alunoId));

        // Verifica se algum aluno já está em 4 disciplinas
        for (const alunoId of alunosParaAdicionar) {
            // Busca o nome do aluno pelo ID
            const aluno = await prisma.aluno.findUnique({
                where: { id: alunoId },
                select: { nome: true } // Apenas o nome é necessário
            });

            if (!aluno) {
                return reply.status(404).send({
                    error: `Aluno com ID ${alunoId} não encontrado.`
                });
            }

            // Conta quantas disciplinas o aluno já está matriculado
            const countDisciplinas = await prisma.disciplina.count({
                where: {
                    alunos: {
                        some: { id: alunoId }
                    }
                }
            });

            // Verifica se o aluno já está em 4 disciplinas
            if (countDisciplinas >= 4) {
                return reply.status(400).send({
                    error: `Aluno ${aluno.nome} já está em 4 disciplinas. Não pode ser adicionado a mais disciplinas.`
                });
            }
        }

        // Adiciona os novos alunos à disciplina
        if (alunosParaAdicionar.length > 0) {
            await prisma.disciplina.update({
                where: { id: disciplinaId },
                data: {
                    alunos: {
                        connect: alunosParaAdicionar.map(alunoId => ({ id: alunoId }))
                    }
                }
            });

            // Cria boletins para os novos alunos com notas iniciando em 0
            for (const alunoId of alunosParaAdicionar) {
                await prisma.boletim.create({
                    data: {
                        alunoId: alunoId,
                        disciplinaId: disciplinaId,
                        nota1: 0,
                        nota2: 0,
                        nota3: 0
                    }
                });
            }
        }

        // Remove os alunos desmarcados da disciplina
        if (alunosParaRemover.length > 0) {
            await prisma.disciplina.update({
                where: { id: disciplinaId },
                data: {
                    alunos: {
                        disconnect: alunosParaRemover.map(alunoId => ({ id: alunoId }))
                    }
                }
            });

            // Remove os boletins dos alunos desmarcados
            await prisma.boletim.deleteMany({
                where: {
                    alunoId: { in: alunosParaRemover },
                    disciplinaId: disciplinaId
                }
            });
        }

        // Obtém a disciplina atualizada com a lista final de alunos
        const updatedDisciplina = await prisma.disciplina.findUnique({
            where: { id: disciplinaId },
            include: { alunos: true }
        });

        return updatedDisciplina;
    } catch (error) {
        console.error('Error updating alunos in disciplina:', error);
        reply.status(500).send({ error: `Failed to update alunos in disciplina: ${error.message}` });
    }
});



// Remove aluno da disciplina
fastify.delete('/disciplina/:disciplinaId/aluno/:alunoId', async (request, reply) => {
    const disciplinaId = parseInt(request.params.disciplinaId);
    const alunoId = parseInt(request.params.alunoId);

    try {
        if (isNaN(disciplinaId) || isNaN(alunoId)) {
            return reply.status(400).send({ error: 'Invalid IDs' });
        }

        // Verifica se a disciplina e o aluno existem
        const disciplina = await prisma.disciplina.findUnique({ where: { id: disciplinaId } });
        const aluno = await prisma.aluno.findUnique({ where: { id: alunoId } });

        if (!disciplina || !aluno) {
            return reply.status(404).send({ error: 'Disciplina or Aluno not found' });
        }

        // Remove o aluno da disciplina
        const updatedDisciplina = await prisma.disciplina.update({
            where: { id: disciplinaId },
            data: {
                alunos: {
                    disconnect: { id: alunoId }
                }
            },
            include: {
                alunos: true
            }
        });

        // Exclui o boletim relacionado à disciplina e ao aluno
        await prisma.boletim.deleteMany({
            where: {
                alunoId: alunoId,
                disciplinaId: disciplinaId
            }
        });

        return reply.status(200).send(updatedDisciplina);
    } catch (error) {
        console.error('Error removing aluno from disciplina:', error);
        reply.status(500).send({ error: `Failed to remove aluno from disciplina: ${error.message}` });
    }
});

fastify.put('/disciplina/:disciplinaId/boletim/:alunoId', async (request, reply) => {
    const disciplinaId = parseInt(request.params.disciplinaId);
    const alunoId = parseInt(request.params.alunoId);
    const { nota1, nota2, nota3 } = request.body;

    try {
        if (isNaN(disciplinaId) || isNaN(alunoId) || typeof nota1 !== 'number' || typeof nota2 !== 'number' || typeof nota3 !== 'number') {
            return reply.status(400).send({ error: 'Invalid input' });
        }

        // Atualiza as notas no boletim do aluno
        const updatedBoletim = await prisma.boletim.update({
            where: {
                alunoId_disciplinaId: {
                    alunoId: alunoId,
                    disciplinaId: disciplinaId
                }
            },
            data: {
                nota1: nota1,
                nota2: nota2,
                nota3: nota3
            }
        });

        return updatedBoletim;
    } catch (error) {
        console.error('Error updating boletim:', error);
        reply.status(500).send({ error: `Failed to update boletim: ${error.message}` });
    }
});


// Delete (DELETE)
fastify.delete('/disciplina/:id', async (request, reply) => {
    const id = parseInt(request.params.id);
    try {
        await prisma.disciplina.delete({
            where: { id },
        });
        return reply.status(204).send(); // No content
    } catch (error) {
        console.error('Error deleting disciplina:', error);
        if (error.code === 'P2025') {
            return reply.status(404).send({ error: 'Disciplina not found' });
        }
        return reply.status(500).send({ error: 'Failed to delete disciplina' });
    }
});

// Criar um boletim
fastify.post('/boletim', async (request: FastifyRequest, reply: FastifyReply) => {
    const { alunoId, disciplinaId, nota1, nota2, nota3 } = request.body as {
        alunoId: number;
        disciplinaId: number;
        nota1: number;
        nota2: number;
        nota3: number;
    };

    try {
        const boletim = await prisma.boletim.create({
            data: {
                alunoId,
                disciplinaId,
                nota1,
                nota2,
                nota3,
            },
        });
        return reply.status(201).send(boletim);
    } catch (error) {
        return reply.status(500).send({ error: 'Erro ao criar boletim' });
    }
});

// Ler boletim por aluno e disciplina
fastify.get('/boletim/:alunoId/:disciplinaId', async (request: FastifyRequest, reply: FastifyReply) => {
    const { alunoId, disciplinaId } = request.params as {
        alunoId: string;
        disciplinaId: string;
    };

    try {
        const boletim = await prisma.boletim.findUnique({
            where: {
                alunoId_disciplinaId: {
                    alunoId: parseInt(alunoId),
                    disciplinaId: parseInt(disciplinaId),
                },
            },
        });

        if (!boletim) {
            return reply.status(404).send({ error: 'Boletim não encontrado' });
        }

        return reply.status(200).send(boletim);
    } catch (error) {
        return reply.status(500).send({ error: 'Erro ao buscar boletim' });
    }
});

// Atualizar um boletim
fastify.put('/boletim/:alunoId/:disciplinaId', async (request: FastifyRequest, reply: FastifyReply) => {
    const { alunoId, disciplinaId } = request.params as {
        alunoId: string;
        disciplinaId: string;
    };
    const { nota1, nota2, nota3 } = request.body as {
        nota1: number;
        nota2: number;
        nota3: number;
    };

    try {
        const boletim = await prisma.boletim.update({
            where: {
                alunoId_disciplinaId: {
                    alunoId: parseInt(alunoId),
                    disciplinaId: parseInt(disciplinaId),
                },
            },
            data: {
                nota1,
                nota2,
                nota3,
            },
        });

        return reply.status(200).send(boletim);
    } catch (error) {
        return reply.status(500).send({ error: 'Erro ao atualizar boletim' });
    }
});

// Excluir um boletim
fastify.delete('/boletim/:alunoId/:disciplinaId', async (request: FastifyRequest, reply: FastifyReply) => {
    const { alunoId, disciplinaId } = request.params as {
        alunoId: string;
        disciplinaId: string;
    };

    try {
        await prisma.boletim.delete({
            where: {
                alunoId_disciplinaId: {
                    alunoId: parseInt(alunoId),
                    disciplinaId: parseInt(disciplinaId),
                },
            },
        });

        return reply.status(204).send();
    } catch (error) {
        return reply.status(500).send({ error: 'Erro ao excluir boletim' });
    }
});

const start = async () => {
    try {
        await fastify.listen({ port: 3000 });
        console.log('Server running at http://localhost:3000');
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};

start();
