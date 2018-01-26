import React from 'react';
import { withTheme } from 'material-ui/styles';
import Card, { CardHeader, CardContent } from 'material-ui/Card';


class PumlImage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            encoded: this.props.encoded,
        };
    };

    componentWillReceiveProps(nextProps) {
        if (this.props.encoded !== nextProps.encoded) {
            this.setState({
                encoded: nextProps.encoded,
            });
        }
    };

    componentDidMount() {
        const cachedEncoded = localStorage.getItem('encoded');
        if (cachedEncoded) {
            this.setState({
                encoded: cachedEncoded
            });
        }
    }


    render() {
        const { encoded } = this.state;
        const { theme } = this.props;
        const styles = {
            cardHeader: {
                backgroundColor: theme.palette.primary[700]
            },
            cardContent: {
                backgroundColor: theme.palette.secondary[400],
            },
            cardActions: {
                backgroundColor: theme.palette.secondary[500],
                padding: 12,
            },
            listRoot: {
                width: '100%',
                borderRadius: "3px",
                backgroundColor: theme.palette.background.paper,
            },
            container: {
                display: 'flex',
                flexWrap: 'wrap',
            },
            textField: {
                margin: theme.spacing.unit,
                width: 200,
            },
            paper: {
                padding: 12,
            },
        };


        return (
                <Card style={styles.card}>
                    <CardHeader
                        style={styles.cardHeader}
                        title="UML"
                    ></CardHeader>
                    <CardContent style={styles.cardContent}>
                       <img src={`http://www.plantuml.com/plantuml/svg/${encoded}`} alt="puml preview" width="100%"/>
                    </CardContent>
                </Card>
        );
    }
}

export default withTheme()(PumlImage);
