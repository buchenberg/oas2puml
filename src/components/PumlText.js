import React from 'react';
import { withTheme } from 'material-ui/styles';
import Card, { CardHeader, CardContent, CardActions } from 'material-ui/Card';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Paper from 'material-ui/Paper';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';

class PumlText extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            copied: false,
            puml: null,
        };
    };

    componentWillReceiveProps(nextProps) {
        if (this.props.puml !== nextProps.puml) {
            this.setState({
                puml: nextProps.puml,
            });
        }
    };

    componentDidMount() {
        const cachedPuml = localStorage.getItem('puml');
        if (cachedPuml) {
            this.setState({
                puml: cachedPuml
            });
        }
    }


    render() {
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
                        title="Puml Text"
                    ></CardHeader>
                    <CardContent style={styles.cardContent}>
                        <Paper elevation={4} style={styles.paper}>
                            {this.state.puml &&
                                this.state.puml.split("\n").map(
                                    (line, index) => {
                                        return <Typography key={`puml-line-${index}`} component="div">{line}</Typography>
                                    })
                            }
                        </Paper>
                    </CardContent>
                    <CardActions style={styles.cardActions}>
                        <CopyToClipboard text={this.state.puml}
                            onCopy={() => this.setState({ copied: true })}>
                            <Button raised dense color="accent">Copy to Clipboard</Button>
                        </CopyToClipboard>
                    </CardActions>
                </Card>
        );
    }
}

export default withTheme()(PumlText);
