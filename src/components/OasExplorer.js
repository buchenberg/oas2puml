import React from 'react';
import { withTheme } from 'material-ui/styles';
import Card, { CardHeader, CardContent } from 'material-ui/Card';
import ReactJson from 'react-json-view';

class OasExplorer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            oas: props.oas,
            fileName: props.title,
        };
    };

    componentWillReceiveProps(nextProps) {
        if(JSON.stringify(this.props.title) !== JSON.stringify(nextProps.title))
        {
            this.setState({
                oas: nextProps.oas,
                fileName: nextProps.title,
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
                backgroundColor: theme.palette.secondary[400]
            },
            explorer: {
                borderRadius: "3px",
                padding: "1em",
            }
        };

        return (
            <div>
                <Card>
                    <CardHeader
                    style={styles.cardHeader}
                    title="OAS Explorer"
                    subheader={`${this.state.fileName}`} />
                    <CardContent style={styles.cardContent} >
                        <ReactJson src={this.state.oas}
                            collapsed={true}
                            displayDataTypes={false}
                            style={styles.explorer}
                            name="oas"
                            theme="greyscale"
                            enableClipboard={false}
                            iconStyle="circle"
                        />
                    </CardContent>
                </Card>
            </div>
        );
    }
}


export default withTheme()(OasExplorer);