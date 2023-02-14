import { Box, useToast, FlatList } from 'native-base';
import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Game, GameProps } from '../components/Game';
import { Loading } from './Loading';
import { EmptyMyPoolList } from './EmptyMyPoolList';

interface Props {
  poolId: string;
  code: string;

}

export function Guesses({ poolId, code }: Props) {

  const [isLoading, setIsLoading] = useState(true);
  const [firstTeamPoint, setFirstTeamPoints] = useState('');
  const [secondTeamPoint, setSecondTeamPoints] = useState('');
  const [games, setGames] = useState([]);
  const toast = useToast();

  async function handleGuessConfirm(gameId: string) {
    try {

      if (!firstTeamPoint.trim() || !secondTeamPoint.trim()) {
        return toast.show({
          title: 'Informe o placar do palpite',
          placement: 'top',
          bgColor: 'red.500'
        });
      }

      console.log('Pool Id', poolId)
      console.log('Game Id', gameId)

      const response = await api.post(`/pools/${poolId}/games/${gameId}/guesses`, {
        firstTeamPoints: 1,
        secondTeamPoints: 1
      });


      console.log(response);

      toast.show({
        title: 'Palpite salvo!',
        placement: 'top',
        bgColor: 'green.500'
      });

      fetchGames();

    } catch (error) {
      console.log(error);

      toast.show({
        title: 'Não foi possível enviar o palpite',
        placement: 'top',
        bgColor: 'red.500'
      });

    } finally {
      setIsLoading(false);
    }

  }


  async function fetchGames() {

    try {
      setIsLoading(true);

      const response = await api.get(`/pools/${poolId}/games`);
      setGames(response.data.games);

    } catch (error) {
      console.log(error);

      toast.show({
        title: 'Não foi possível carregar os jogos',
        placement: 'top',
        bgColor: 'red.500'
      });

    } finally {
      setIsLoading(false);
    }

  }

  useEffect(() => {
    fetchGames();
  }, [poolId]);

  if(isLoading)
   return <Loading/>

  return (
    <FlatList data={games} 
      ListEmptyComponent={() => {<EmptyMyPoolList code={code} />}}
      keyExtractor={item => item.id} renderItem={({ item }) => (
      <Game
        data={item}
        setFirstTeamPoints={setFirstTeamPoints}
        setSecondTeamPoints={setSecondTeamPoints}
        onGuessConfirm={() => {handleGuessConfirm(item.id)}}
      />
    )}
    _contentContainerStyle={{pb: 10}}
    /> 
  );
}
