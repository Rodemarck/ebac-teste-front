import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Button, Card, Col, Container, Modal, Row, Form, ButtonProps } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import api from '../api';
import { logout } from '../store/reducers/auth';
import { Task } from '../types/task'

// Definindo os tipos para os itens
type Status = 'Pendente' | 'Em andamento' | 'Concluída';
let estados: Status[] = ['Pendente', 'Em andamento', 'Concluída'];
interface CardItem {
    id: number;
    title: string;
    description: string;
    status: Status;
    deadline: Date;
}

const getStatus = (status: string): Status => {
    switch (status) {
        case 'Pendente':
            return 'Pendente';
        case 'Em andamento':
            return 'Em andamento';
        default:
            return 'Concluída';
    }
};



const CardWrapper = styled.div`
  cursor: move;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  flex: 1 0 21%; /* Flexbox para garantir que os cards se ajustem */
  margin-bottom: 10px;
  
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
  
  &:active {
    transform: scale(1);
  }`
    ;

// Estilo para o Container de Cards com flexbox centralizado
const CardsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center; /* Centraliza os cards horizontalmente */
  gap: 20px; /* Aumenta o espaçamento entre os cards */
  margin-top: 20px;
`;

const StatusTagContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;`
    ;

const StatusTag = styled.div<{ isSelected: boolean }>`
  background-color: ${({ isSelected }) => (isSelected ? '#007bff' : '#6c757d')}; /* Azul para o selecionado e cinza para os outros */
  color: white;
  padding: 3px 8px; /* Diminuímos o padding */
  font-size: 12px;  /* Diminuímos o tamanho da fonte */
  border-radius: 20px;
  font-weight: bold;
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }`
    ;

const FloatingButton = styled((props: ButtonProps) => <Button {...props} />)`
  position: fixed;
  bottom: 20px;
  right: 20px;
  padding: 15px 20px;
  font-size: 24px;
  border-radius: 50%;
  background-color: #007bff;
  color: white;
  border: none;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);

  &:hover {
    background-color: #0056b3;
  }
`;
;

const AvatarWrapper = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  background-color: #007bff;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 20px;
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);

  &:hover {
    opacity: 0.8;
  }
`;
const HomePage = () => {
    const dispatch = useDispatch()
    const [cards, setCards] = useState<CardItem[]>([]);
    const [filteredCards, setFilteredCards] = useState<CardItem[]>([]); // Estado para armazenar cards filtrados
    const [showModal, setShowModal] = useState(false);
    const [selectedTask, setSelectedTask] = useState<CardItem | null>(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [deadLine, setDeadLine] = useState(new Date());
    const [create, setCreate] = useState(false);

    const [statusFilter, setStatusFilter] = useState<Status | 'Todos'>('Todos');
    const [dateFilter, setDateFilter] = useState<Date | null>(null);

    const handleLogout = () => {
        dispatch(logout())
        window.location.reload()
        console.log("Logout realizado");
    };
    useEffect(() => {
        api.get('/task')
            .then(tasks => {
                console.log(tasks.data);
                setCards(tasks.data.tasks.map((task: Task) => {
                    console.log(task);

                    return {
                        id: task.id,
                        title: task.title,
                        description: task.description,
                        status: getStatus(task.status),
                        deadline: new Date(task.deadLine),
                    }
                }))

            })
            .catch(e => {
                handleLogout();
            })
    }, []);

    // Função para aplicar os filtros
    const applyFilters = () => {
        let filtered = [...cards];

        if (statusFilter !== 'Todos') {
            filtered = filtered.filter((card) => card.status === statusFilter);
        }

        if (dateFilter) {

            filtered = filtered.filter((card) => card.deadline.getFullYear() === dateFilter.getFullYear() &&
                card.deadline.getMonth() === dateFilter.getMonth() &&
                card.deadline.getDate() === dateFilter.getDate());
        }

        setFilteredCards(filtered);
    };

    useEffect(() => {
        applyFilters();
    }, [statusFilter, dateFilter, cards]);

    const actionHandler = () => {
        if (create) {
            createNewTask()
        } else {
            updateTask()
        }
    }

    const updateTask = async () => {
        if (selectedTask) {
            const updatedCard = { ...selectedTask, title, description, deadline: deadLine };
            const id = updatedCard.id;

            // Atualiza o card e não retorna null com o map
            setCards(cards.map(card => card.id === id ? updatedCard : card));

            setShowModal(false); // Fecha o modal
        }

        // Aqui você implementa a lógica de atualização do card no backend
    };

    const createNewTask = () => {
        const newTask: CardItem = {
            id: cards.length + 1, // Gerando um ID único para a nova task
            title,
            description,
            status: 'Pendente', // Inicialmente o status pode ser "Pendente"
            deadline: deadLine,
        };
        setCards([...cards, newTask]);
        setShowModal(false);
        setTitle('');
        setDescription('');
        setDeadLine(new Date());
    };

    const handleDoubleClick = (card: CardItem) => {
        setCreate(false);
        setSelectedTask(card);
        setTitle(card.title);
        setDescription(card.description);
        setDeadLine(card.deadline);
        setShowModal(true); // Exibe o modal
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedTask(null);
    };

    const handleStatusChange = (cardId: number, newStatus: Status) => {
        setCards(cards.map(card =>
            card.id === cardId ? { ...card, status: newStatus } : card
        ));
    };

    const handleUpdate = () => {
        if (selectedTask) {
            const updatedCard = { ...selectedTask, title, description, deadline: deadLine };
            setCards(cards.map(card => card.id === updatedCard.id ? updatedCard : card)); // Atualiza o estado com o card modificado
            setShowModal(false); // Fecha o modal
        }
    };

    const handleCreate = () => {
        setCreate(true);
        setDeadLine(new Date());
        setTitle("");
        setDescription("");
        setShowModal(true)
    }

    return (

        <Container>
            <AvatarWrapper onClick={handleLogout}>
                A
            </AvatarWrapper>
            <h2>Cards Arrastáveis com React Bootstrap e Styled Components</h2>

            {/* Filtros */}
            <Row className="mb-3">
                <Col md={4}>
                    <Form.Group>
                        <Form.Label>Status</Form.Label>
                        <Form.Control
                            as="select"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value as Status | 'Todos')}
                        >
                            <option value="Todos">Todos</option>
                            <option value="Pendente">Pendente</option>
                            <option value="Em andamento">Em andamento</option>
                            <option value="Concluída">Concluída</option>
                        </Form.Control>
                    </Form.Group>
                </Col>

                <Col md={4}>
                    <Form.Group>
                        <Form.Label>Data</Form.Label>
                        <Form.Control
                            type="date"
                            value={dateFilter ? dateFilter.toISOString().slice(0, 10) : ''}
                            onChange={(e) => setDateFilter(e.target.value ? new Date(e.target.value) : null)}
                        />
                    </Form.Group>
                </Col>
            </Row>

            <CardsContainer>
                {filteredCards.map((card, index) => (
                    <Col key={card.id} sm={12} md={6} lg={3}>
                        <CardWrapper
                            draggable
                            onDoubleClick={() => handleDoubleClick(card)} // Abre o modal ao dar duplo clique
                        >
                            <StatusTagContainer>
                                {estados.map((status: Status) => (
                                    <StatusTag
                                        key={getStatus(status)}
                                        isSelected={card.status === status}
                                        onClick={() => handleStatusChange(card.id, getStatus(status))}
                                    >
                                        {status}
                                    </StatusTag>
                                ))}
                            </StatusTagContainer>

                            <Card>
                                <Card.Body>
                                    <Card.Title>{card.title}</Card.Title>
                                    <Card.Text>{card.description}</Card.Text>
                                    <Card.Text><strong>Deadline:</strong> {card.deadline.toLocaleDateString()}</Card.Text>
                                </Card.Body>
                            </Card>
                        </CardWrapper>
                    </Col>
                ))}
            </CardsContainer>

            {/* Modal para exibir e editar a task */}
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>{selectedTask?.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group controlId="formTitle">
                        <Form.Label>Título</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={1}
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group controlId="formDescription">
                        <Form.Label>Descrição</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group controlId="formDeadline">
                        <Form.Label>Deadline</Form.Label>
                        <Form.Control
                            type="date"
                            value={deadLine.toISOString().slice(0, 10)}
                            onChange={(e) => setDeadLine(new Date(e.target.value))}
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Fechar
                    </Button>
                    <Button variant="primary" onClick={handleUpdate}>
                        Atualizar
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Botão flutuante para criar novas tasks */}
            <FloatingButton onClick={handleCreate}>+</FloatingButton>
        </Container>
    );
};

export default HomePage;
