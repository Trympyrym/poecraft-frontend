import {Accordion, AccordionDetails, AccordionSummary, Box, Typography} from "@material-ui/core";
import React, {useEffect, useState} from "react";
import {ExpandMore} from "@material-ui/icons";
import SlamStage from "./SlamStage";
import SpamStage from "./SpamStage";

const Algorithms = (props) => {

    const [expanded, setExpanded] = useState();

    useEffect(()=>{
        setExpanded(props.algorithms.map(x=>false))
    }, [props.algorithms])

    const templatePrice = (price) => {
        if (price === 'Infinity') {
            return <Typography variant={'h3'}>{'Estimated price: Much more...'}</Typography>
        }
        return <Typography variant={'h3'}>{`Estimated price: ${Number(price.toPrecision(1)).toFixed()} Chaos Orbs`}</Typography>
    }

    const templateStageName = (index, name) => {

        const stageNameMap = {
            PickBaseStage: 'Pick base item',
            TransmutationSlamStage: 'Use Orb of Transmutation',
            AlterationSpamStage: 'Spam Orb of Alteration',
            AugmentationSlamStage: 'Use Orb of Augmentation',
        }

        return (
            <Typography variant={'h4'}>
                {`${index + 1}. ${stageNameMap[name]}`}
            </Typography>
        )
    }

    const handleExpand = (index, isExpanded) => {
        setExpanded(isExpanded ? index : undefined)
    }

    return (
        <Box border={2} p={'20px'} m={'10px 0'}>
        {props.algorithms.map((algorithm, algorithmIndex) => (
            <Accordion key={algorithmIndex} expanded={expanded === algorithmIndex} onChange={(event, isExpanded) => handleExpand(algorithmIndex, isExpanded)}>
                <AccordionSummary
                    expandIcon={<ExpandMore />}
                    aria-controls={`accordion${algorithmIndex}-content`}
                    id={`accordion${algorithmIndex}-header`}
                >
                    {templatePrice(algorithm.price)}
                </AccordionSummary>
                <AccordionDetails>
                    <Box border={1}>
                        {algorithm.stages.map((stage, stageIndex) => (
                            <Box key={stageIndex} border={1} p={'20px'} m={'10px'}>
                                {templateStageName(stageIndex, stage.name)}
                                {stage.type === 'SLAM' && <SlamStage stage={stage} usedAffixes={props.usedAffixes}/>}
                                {stage.type === 'SPAM' && <SpamStage stage={stage} usedAffixes={props.usedAffixes}/>}
                            </Box>
                        ))}
                    </Box>
                </AccordionDetails>
            </Accordion>))}
        </Box>
    )
}

export default Algorithms;