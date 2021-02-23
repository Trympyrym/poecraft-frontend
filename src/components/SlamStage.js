import {Box, Table, TableBody, TableCell, TableRow, Typography} from "@material-ui/core";

const SlamStage = (props) => {

    const templateOnMatch = (elem, index) => {

        const text = elem.nextStageIndex === null ? 'Crafted! Lucky 4 you!' : `GOTO ${elem.nextStageIndex + 1}`

        let prefixCondition = '';
        let suffixCondition = '';

        elem.conditions.forEach(condition => {
            if (condition.name === 'NoPrefixCondition') {
                prefixCondition = 'Empty prefix';
            } else if (condition.name === 'NoSuffixCondition') {
                suffixCondition = 'Empty suffix';
            } else {
                const affix = props.usedAffixes[condition.affixId];
                if (affix.affixType === 'PREFIX') {
                    prefixCondition = affix.translation;
                } else {
                    suffixCondition = affix.translation;
                }
            }
        })

        return (
            <TableRow key={index}>
                <TableCell>
                    {!!prefixCondition && <Typography>{prefixCondition}</Typography>}
                    {!!suffixCondition && <Typography>{suffixCondition}</Typography>}
                </TableCell>
                <TableCell align={'left'}>
                    <Typography>{text}</Typography>
                </TableCell>
            </TableRow>
        )
    };

    return (
        <Box>
            <Typography>{'Use it once and check:'}</Typography>
            <Table>
                <TableBody>
                    {props.stage.onMatch.map((elem, index) => (
                        templateOnMatch(elem, index)
                    ))}
                    <TableRow>
                        <TableCell>{'Otherwise'}</TableCell>
                        <TableCell>{`GOTO ${props.stage.onFailGoto + 1}`}</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </Box>
    )
}

export default SlamStage;