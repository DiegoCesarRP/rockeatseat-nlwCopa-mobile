import { HStack, Toast, useToast, VStack } from "native-base";
import { useState, useEffect } from 'react';
import { Share } from 'react-native';
import { api } from '../services/api';
import { useRoute } from '@react-navigation/native'
import { Header } from "../components/Header";
import { Loading } from "../components/Loading";
import { Guesses } from "../components/Guesses";
import { Option } from "../components/Option";
import { PoolCardProps } from '../components/PoolCard'
import { PoolHeader } from "../components/PoolHeader";
import { EmptyMyPoolList } from "../components/EmptyMyPoolList";

interface RouteParams {
    id: string,
}

export function Details() {

    const route = useRoute();
    const [optionSelected, setOptionSelected] = useState<'guesses' | 'ranking'>('guesses');
    const [poolDetails, setPoolDetails] = useState<PoolCardProps>({} as PoolCardProps);

    async function handleCodeShare(){
        await Share.share({
            message: poolDetails.code
        })
    }

    const [isLoading, setIsLoading] = useState(true);
    const { id } = route.params as RouteParams;
    const toast = useToast();

    async function fetchPoolDetails() {
        try {
            setIsLoading(true);
            const response = await api.get(`/pools/${id}`);
            setPoolDetails(response.data.pool);
        } catch (error) {
            console.log(error);
            toast.show({
                title: 'Não foi possível carregar os bolões!',
                placement: 'top',
                bgColor: 'red.500'
            })
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchPoolDetails()
    }, [id])

    if (isLoading) return <Loading />

    return (
        <VStack flex={1} bgColor="gray.900">
            <Header 
                title={poolDetails.title} 
                onShare={handleCodeShare}
                showBackButton 
                showShareButton />
            {
                poolDetails._count?.participants > 0 ?
                    <VStack px={5} flex={1}>
                         <PoolHeader data={poolDetails}/>
                         <HStack bgColor="gray.800" p={1} rounded="sm" mb={5}>
                            <Option title="Seus palpites" isSelected={optionSelected === 'guesses'} onPress={()=> setOptionSelected('guesses')}/>
                            <Option title="Ranking do grupo" isSelected={optionSelected === 'ranking'} onPress={()=> setOptionSelected('ranking')}/>
                         </HStack>
                         <Guesses poolId={poolDetails.id} code={poolDetails.code}/>
                    </VStack>
                 : <EmptyMyPoolList code={poolDetails.code}/>
            }

        </VStack>
    );
}