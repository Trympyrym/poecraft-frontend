import React, {useCallback, useEffect, useState} from 'react';
import {Box, Button, Container, CssBaseline, TextField, Typography} from "@material-ui/core";
import {Autocomplete} from "@material-ui/lab";
import Algorithms from "./components/Algorithms";

function App() {

    // const BACKEND_HOST = window.origin;
    const BACKEND_HOST = 'http://138.197.183.108/api';

    const BASES = ['CLAW', 'TWO-HANDED SWORD']

    const ANY_PREFIX = {id: 'ANY', value: 'Any'};
    const ANY_SUFFIX = {id: 'ANY', value: 'Any'};

    const [prefixSelected, setPrefixSelected] = useState({id: 'ANY', value: 'Any'})
    const [suffixSelected, setSuffixSelected] = useState({id: 'ANY', value: 'Any'})
    const [prefixes, setPrefixes] = useState([{id: 'ANY', value: 'Any'}, {id: 'EMPTY', value: 'Empty'}])
    const [suffixes, setSuffixes] = useState([{id: 'ANY', value: 'Any'}, {id: 'EMPTY', value: 'Empty'}])
    const [algorithms, setAlgorithms] = useState([])

    const loadData = ()=>{
        const url = new URL(`${BACKEND_HOST}/affixes`);
        fetch(url.toString())
            .then(response=>response.json())
            .then(response=> {
                let prefixesLocal = [{id: 'ANY', value: 'Any'}, {id: 'EMPTY', value: 'Empty'}];
                let suffixesLocal = [{id: 'ANY', value: 'Any'}, {id: 'EMPTY', value: 'Empty'}];
                response.forEach(affix => {
                    if (affix.affixType === 'PREFIX') {
                        prefixesLocal.push({id: affix.id, value: affix.translation});
                    }

                    if (affix.affixType === 'SUFFIX') {
                        suffixesLocal.push({id: affix.id, value: affix.translation});
                    }
                })
                setPrefixes(prefixesLocal);
                setSuffixes(suffixesLocal);
            })
    }

    useEffect(loadData, [])

    const templateAffix = (affix)=> {
        if (affix.value.includes(';')) {
            let strings = affix.value.split(';');
            return (
                <>
                    {strings[0]}
                    <br />
                    {strings[1]}
                </>
            )
        } else {
            return affix.value;
        }
    }

    const mapConditionsResponse = (value) => {
        return {
            name: value.name,
            affixId: value.affixId
        }
    }

    const mapOnMatchResponse = useCallback((value) => {
        return {
            nextStageIndex: value.nextStageIndex,
            conditions: value.conditions.map(mapConditionsResponse)
        }
    }, []);

    const mapStagesResponse = useCallback((value) => {
        return {
            name: value.name,
            type: value.stageType,
            onFailGoto: value.onFailGoto,
            onMatch: value.onMatch.map(mapOnMatchResponse)
        }
    }, [mapOnMatchResponse])

    const mapAlgorithmsResponse = useCallback((response) => {
        return {
            algorithms: response.algorithms.map((value) => ({
                price: value.price,
                stages: value.stages.map(mapStagesResponse)
            })),
            usedAffixes: response.usedAffixes
        }
    }, [mapStagesResponse])

    const handleCraftButtonClick = useCallback(() => {
        const url = new URL(`${BACKEND_HOST}/algorithm`);
        fetch(url.toString(), {method: 'POST', body: JSON.stringify(
                {
                    prefixId: prefixSelected?.id,
                    suffixId: suffixSelected?.id
                }
            ), headers: {'Content-Type': 'application/json'}})
            .then(response=>response.json())
            .then(response=> {
                setAlgorithms(mapAlgorithmsResponse(response));
            })
    }, [mapAlgorithmsResponse, prefixSelected?.id, suffixSelected?.id]);

    return (
        <>
            <CssBaseline/>
            <Container maxWidth={'lg'}>
                <Typography variant={'h1'}>I wanna be the crafter</Typography>
                <Box border={2} p={'10px'}>
                    <Typography variant={'h2'}>What I wanna craft ?</Typography>
                    <Box border={1} p={'20px'}>
                        <Autocomplete
                            style={{width: '300px', marginBottom: '20px'}}
                            renderInput={(params => <TextField {...params} label={"Base Item"} variant={"outlined"}/>)}
                            options={BASES}/>
                        <Autocomplete
                            style={{width: '400px', marginBottom: '20px'}}
                            renderInput={(params => <TextField {...params} label={"Prefix"} variant={"outlined"}/>)}
                            renderOption={templateAffix}
                            getOptionLabel={affix=>affix.value}
                            getOptionSelected={(option, value) => option?.id === value?.id}
                            options={prefixes}
                            onChange={(event, data)=>{setPrefixSelected(data || ANY_PREFIX)}}
                        />
                        <Autocomplete
                            style={{width: '400px', marginBottom: '20px'}}
                            renderInput={(params => <TextField {...params} label={"Suffix"} variant={"outlined"}/>)}
                            renderOption={templateAffix}
                            getOptionLabel={affix=>affix.value}
                            getOptionSelected={(option, value) => option?.id === value?.id}
                            options={suffixes}
                            onChange={(event, data)=>{setSuffixSelected(data || ANY_SUFFIX)}}
                        />
                        <Button variant={'contained'} onClick={handleCraftButtonClick}>Tell me how I craft it</Button>
                    </Box>
                </Box>
                {!!algorithms.algorithms?.length && <Algorithms algorithms={algorithms.algorithms} usedAffixes = {algorithms.usedAffixes} />}
            </Container>

        </>
    );
}

export default App;
