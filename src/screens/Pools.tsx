import { useEffect, useCallback, useState } from 'react';
import { Icon, Toast, useToast, VStack, FlatList } from "native-base";
import { Octicons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native"
import { Button } from "../components/Button";
import { Header } from "../components/Header";
import { api } from '../services/api';
import { PoolCard, PoolCardProps } from '../components/PoolCard';
import { Loading } from '../components/Loading';
import { EmptyPoolList } from '../components/EmptyPoolList';
import { useFocusEffect } from '@react-navigation/native'


export function Pools() {

    const toast = useToast();
    const { navigate } = useNavigation();
    const [isLoading, setIsLoading] = useState(true);
    const [pools, setPools] = useState<PoolCardProps[]>([]);

    useFocusEffect(useCallback(() => { fetchPools(); }, []))


    async function fetchPools() {
        try {
            setIsLoading(true);
            const response = await api.get('/pools')
            setPools(response.data.pools)
        } catch (error) {
            console.log(error);
            Toast.show({
                title: 'Não foi possível carregar os bolões!',
                placement: 'top',
                bgColor: 'red.500'
            })
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <VStack flex={1} bgColor="gray.900">
            <Header title="Meus bolões" onShare={() => {}} />
            <VStack mt={6} mx={5} borderBottomWidth={1} borderBottomColor="gray.600" pb={4} mb={4}>
                <Button title="BUSCAR BOLÃO POR CÓDIGO"
                    leftIcon={<Icon as={Octicons} name="search" color="black" size="md" />}
                    onPress={() => navigate('find')}
                />
            </VStack>
            {
                isLoading ? <Loading /> :
                    <FlatList
                        data={pools}
                        keyExtractor={item => item.id}
                        renderItem={({ item }) => (
                            <PoolCard 
                                data={item}
                                onPress={() => navigate('details', {id: item.id})}
                            />
                        )}
                        px={5}
                        showsVerticalScrollIndicator={false}
                        _contentContainerStyle={{
                            pb: 10
                        }}
                        ListEmptyComponent={() => <EmptyPoolList />}
                    />}
        </VStack>
    )
}