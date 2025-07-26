import { useEffect, useState } from "react";
import styled from "styled-components";
import {
  Button,
  Card,
  Col,
  Container,
  Modal,
  Row,
  Form,
  ButtonProps,
} from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../store/hooksTipados";
import { logout } from "../store/reducers/auth";
import { fetchTasks, createTask, updateTask, deleteTask } from "../store/reducers/task";
import { RootState } from "../store";
import { Task, Status } from "../types/task";
import { idText } from "typescript";

const estados: Status[] = ["Pendente", "Em andamento", "Concluída"];
interface CardItem {
  id?: number;
  title: string;
  description: string;
  status: Status;
  deadline: string; // ISO string: '2025-07-25'
}

const enumConvert = {
  PENDING: "Pendente",
  IN_PROGRESS: "Em andamento",
  DONE: "Concluída",
  Pendente: "PENDING",
  "Em andamento": "IN_PROGRESS",
  Concluída: "DONE",
};

const getStatus = (status: string): Status => {
  switch (status) {
    case "PENDING":
      return "Pendente";
    case "IN_PROGRESS":
      return "Em andamento";
    case "DONE":
      return "Concluída";
    case "Pendente":
    case "Em andamento":
    case "Concluída":
      return status as Status;
    default:
      return "Concluída";
  }
};

const CardWrapper = styled.div`
  cursor: move;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  flex: 1 0 21%;
  margin-bottom: 10px;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }

  &:active {
    transform: scale(1);
  }
`;

const CardsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
`;

const StatusTagContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
`;

const StatusTag = styled.div<{ isSelected: boolean }>`
  background-color: ${({ isSelected }) => (isSelected ? "#007bff" : "#6c757d")};
  color: white;
  padding: 3px 8px;
  font-size: 12px;
  border-radius: 20px;
  font-weight: bold;
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }
`;

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
  const dispatch = useAppDispatch();
  const tasks = useAppSelector((state) => state.task.items);
  const user = useAppSelector((state) => state.auth.user);

  const [cards, setCards] = useState<CardItem[]>([]);
  const [filteredCards, setFilteredCards] = useState<CardItem[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<CardItem | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [create, setCreate] = useState(false);

  const [statusFilter, setStatusFilter] = useState<Status | "Todos">("Todos");
  const [dateFilter, setDateFilter] = useState<Date | null>(null);

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  useEffect(() => {
    const mappedCards = tasks.map((task: Task) => ({
      id: task?.id,
      title: task.title,
      description: task.description,
      status: getStatus(task.status || "PENDING"),
      deadline: new Date(task.deadLine).toISOString(),
    }));
    setCards(mappedCards);
  }, [tasks]);

  useEffect(() => {
    applyFilters();
  }, [cards, statusFilter, dateFilter]);

  const applyFilters = () => {
    let filtered = cards;

    if (statusFilter !== "Todos") {
      filtered = filtered.filter((card) => card.status === statusFilter);
    }

    if (dateFilter) {
      filtered = filtered.filter((card) => {
        const cardDate = new Date(card.deadline);
        return (
          cardDate.getFullYear() === dateFilter.getFullYear() &&
          cardDate.getMonth() === dateFilter.getMonth() &&
          cardDate.getDate() === dateFilter.getDate()
        );
      });
    }

    setFilteredCards(filtered);
  };

  const actionHandler = () => {
    const payload = {
      title,
      description,
      status: "PENDING",
      deadLine: new Date(deadline),
    };

    if (create) {
      dispatch(createTask(payload));
    } else {
      dispatch(
        updateTask({
          id: selectedTask?.id,
          title,
          description,
          deadLine: new Date(deadline),
          status: getStatus(enumConvert[selectedTask?.status || 'PENDING']),
        })
      );
    }

    setShowModal(false);
    setTitle("");
    setDescription("");
    setDeadline("");
    setSelectedTask(null);
  };

  const handleDoubleClick = (card: CardItem) => {
    setCreate(false);
    setSelectedTask(card);
    setTitle(card.title);
    setDescription(card.description);
    setDeadline(card.deadline);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedTask(null);
  };

  const handleCreate = () => {
    setCreate(true);
    setTitle("");
    setDescription("");
    setDeadline(new Date().toISOString().slice(0, 10));
    setShowModal(true);
  };

  const handleStatusChange = (card: CardItem, newStatus: Status) => {
    const updatedCard = { ...card, status: newStatus };
    setCards((prev) => prev.map((c) => (c.id === card.id ? updatedCard : c)));

    dispatch(
      updateTask({
        id: updatedCard.id,
        title: updatedCard.title,
        description: updatedCard.description,
        deadLine: new Date(updatedCard.deadline),
        status: getStatus(newStatus),
      })
    );
  };

  const handleRemove = () => {
    console.log('remover');
    console.log(selectedTask)

    dispatch(deleteTask(selectedTask?.id || 0))
  }

  return (
    <Container>
      <AvatarWrapper onClick={() => { dispatch(logout()); window.location.reload(); }}>A</AvatarWrapper>

      <center>
        <Row className="mb-3">
          <Col md={4}>
            <Form.Group>
              <Form.Label>Status</Form.Label>
              <Form.Control
                as="select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as Status | "Todos")}
              >
                <option value="Todos">Todos</option>
                {estados.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Col>

          <Col md={4}>
            <Form.Group>
              <Form.Label>Data</Form.Label>
              <Form.Control
                type="date"
                value={dateFilter ? dateFilter.toISOString().slice(0, 10) : ""}
                onChange={(e) =>
                  setDateFilter(e.target.value ? new Date(e.target.value) : null)
                }
              />
            </Form.Group>
          </Col>
        </Row>
      </center>

      <CardsContainer>
        {filteredCards.map((card) => (
          <Col key={card.id} sm={12} md={6} lg={3}>
            <CardWrapper onDoubleClick={() => handleDoubleClick(card)}>
              <StatusTagContainer>
                {estados.map((status) => (
                  <StatusTag
                    key={status}
                    isSelected={card.status === status}
                    onClick={() => handleStatusChange(card, status)}
                  >
                    {status}
                  </StatusTag>
                ))}
              </StatusTagContainer>

              <Card>
                <Card.Body>
                  <Card.Title>{card.title}</Card.Title>
                  <Card.Text>{card.description}</Card.Text>
                  <Card.Text>
                    <strong>Deadline:</strong>{" "}
                    {new Date(card.deadline).toLocaleDateString()}
                  </Card.Text>
                </Card.Body>
              </Card>
            </CardWrapper>
          </Col>
        ))}
      </CardsContainer>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {create ? "Nova Tarefa" : selectedTask?.title}
          </Modal.Title>
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
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Fechar
          </Button>
          <Button variant="danger" onClick={handleRemove}>
            Deletar
          </Button>
          <Button variant="primary" onClick={actionHandler}>
            {create ? "Criar" : "Atualizar"}
          </Button>
        </Modal.Footer>
      </Modal>

      <FloatingButton onClick={handleCreate}>+</FloatingButton>
    </Container>
  );
};

export default HomePage;
