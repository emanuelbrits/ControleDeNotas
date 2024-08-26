export const getProfessores = async () => {
    try {
        const response = await fetch('http://localhost:3000/professores', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();
        console.log('Lista de professores:', data);
    } catch (error) {
        console.error('Erro ao obter professores:', error);
    }
};
