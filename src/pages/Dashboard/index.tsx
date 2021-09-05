import { Header } from '../../components/Header';
import api from '../../services/api';
import { Food } from '../../components/Food';
import { ModalAddFood } from '../../components/ModalAddFood';
import { ModalEditFood } from '../../components/ModalEditFood';
import { FoodsContainer } from './styles';

import { useState, useEffect } from 'react';

interface FoodProps {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  available: boolean;
}

interface FoodParamsProps {
  name: string;
  description: string;
  price: number;
  image: string;
}

interface ResponseProps {
  data: {
    id: number;
    name: string;
    description: string;
    price: number;
    image: string;
    available: boolean;
  }
}

interface EditingFoodProps {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
}

export function Dashboard() {
  const [foods, setFoods] = useState<FoodProps[]>([]) ;
  const [editingFood, setEditingFood] = useState({} as EditingFoodProps);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  useEffect(() => {
    async function getData() {
      const response = await api.get('/foods');

      setFoods(response.data)
    }

    getData()
  }, []);

  async function handleAddFood(food: FoodParamsProps) {
    try {
      const response: ResponseProps = await api.post('/foods', {
        ...food,
        available: true,
      });

      setFoods([...foods, response.data])
    } catch (err) {
      console.log(err);
    }
  }

  async function handleUpdateFood(food: FoodParamsProps) {
    try {
      const foodUpdated = await api.put(
        `/foods/${editingFood.id}`,
        { ...editingFood, ...food },
      );

      const foodsUpdated = foods.map<FoodProps>(f =>
        f.id !== foodUpdated.data.id ? f : foodUpdated.data,
      );

      setFoods(foodsUpdated)
    } catch (err) {
      console.log(err);
    }
  }

  async function handleDeleteFood(id: number) {

    await api.delete(`/foods/${id}`);

    const foodsFiltered = foods.filter(food => food.id !== id);

    setFoods(foodsFiltered)
  }

  function toggleModal() {
    setModalOpen(!modalOpen)
  }

  function toggleEditModal() {
    setEditModalOpen(!editModalOpen)
  }

  function handleEditFood(food: FoodProps) {
    setEditModalOpen(true);
    setEditingFood(food);
  }

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map(food => (
            <Food
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  );
}