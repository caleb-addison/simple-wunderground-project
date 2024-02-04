import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import InputGroup from 'react-bootstrap/InputGroup';

const ApiCaller = ({ onDataReceived }) => {
    const [endpoint, setEndpoint] = useState('');
    const [endpointText, setEndpointText] = useState('');
    const [pathParams, setPathParams] = useState({
        apiKey: '',
        stationId: '',
        unit: '',
    });
    const [rememberMe, setRememberMe] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [outputMessage, setOutputMessage] = useState({
        message: '',
        class: '',
    });
    const [queryTimestamp, setQueryTimestamp] = useState(null);
    const [apiParams, setApiParams] = useState({
        numericPrecision: 'decimal',
    });
    const [jsonData, setJsonData] = useState('');

    // References
    const endpointRef = useRef(null);
    const apikeyRef = useRef(null);
    const stationIdRef = useRef(null);
    const unitRef = useRef(null);

    // Values
    const baseApiUrl = 'https://api.weather.com/v2/pws/';
    const apiEndpoints = [
        {
            text: 'Current Conditions',
            url: 'observations/current',
            params: ['numericPrecision'],
        },
        {
            text: '7 Day History',
            url: 'dailysummary/7day',
            params: ['numericPrecision'],
        },
    ];
    const units = [
        { value: 'e', displayText: 'English units' },
        { value: 'm', displayText: 'Metric units' },
        { value: 'h', displayText: 'Hybrid units (UK)' },
        { value: 's', displayText: 'Metric SI units' },
    ];

    const setEndpointHelper = (url, text) => {
        setEndpoint(url);
        setEndpointText(text);
    };

    // Hooks
    useEffect(() => {
        const rememberMeCookie = Cookies.get('rememberMe');
        setRememberMe(rememberMeCookie === 'true');

        const apiKeyCookie = Cookies.get('apiKey');
        const stationIdCookie = Cookies.get('stationId');
        const unitCookie = Cookies.get('unit');

        setPathParams({
            apiKey: apiKeyCookie || '',
            stationId: stationIdCookie || '',
            unit: unitCookie || '',
        });
    }, []);

    // Helpers
    function isParamInEndpoint(paramName) {
        const endpointObj = apiEndpoints.find((obj) => obj.url === endpoint);
        return endpointObj && endpointObj.params.includes(paramName);
    }

    const constructApiUrl = () => {
        return (
            `${baseApiUrl}${endpoint}?` +
            `apiKey=${pathParams.apiKey}&` +
            `format=json&` +
            `units=${pathParams.unit}&` +
            `stationId=${pathParams.stationId}`
        );
    };

    const setCookies = () => {
        Cookies.set('rememberMe', rememberMe, { expires: 7 });
        Cookies.set('apiKey', pathParams.apiKey, { expires: 7 });
        Cookies.set('stationId', pathParams.stationId, { expires: 7 });
        Cookies.set('unit', pathParams.unit, { expires: 7 });
    };

    const clearCookies = () => {
        Cookies.remove('rememberMe');
        Cookies.remove('apiKey');
        Cookies.remove('stationId');
        Cookies.remove('unit');
    };

    const getFilteredApiParams = () => {
        const endpointParams =
            apiEndpoints.find((item) => item.url === endpoint)?.params || [];
        const filteredParams = {};

        console.log('endpointParams:', endpointParams);

        if (endpointParams) {
            for (const param of endpointParams) {
                if (param in apiParams && apiParams[param] !== '') {
                    filteredParams[param] = apiParams[param];
                }
            }
        }

        console.log('filter: ', apiParams, filteredParams);
        return filteredParams;
    };

    const setRememberMeHelper = (checked) => {
        setRememberMe(checked);
        if (!checked) {
            clearCookies();
        }
    };

    const fetchData = async () => {
        // Reset message
        setOutputMessage({
            message: '',
            class: '',
        });
        setQueryTimestamp(null);

        // Validate inputs
        if (!endpoint) {
            endpointRef.current.focus();
            setOutputMessage({
                message: 'Please specify endpoint',
                class: 'info',
            });
            return;
        }

        if (!pathParams.apiKey) {
            apikeyRef.current.focus();
            setOutputMessage({
                message: 'Please specify API Key',
                class: 'info',
            });
            return;
        } else if (!pathParams.stationId) {
            stationIdRef.current.focus();
            setOutputMessage({
                message: 'Please specify Station ID',
                class: 'info',
            });
            return;
        } else if (!pathParams.unit) {
            unitRef.current.focus();
            setOutputMessage({
                message: 'Please specify Unit',
                class: 'info',
            });
            return;
        }

        rememberMe ? setCookies() : clearCookies();
        try {
            setIsLoading(true);
            const response = await axios.get(constructApiUrl(), {
                params: getFilteredApiParams(),
            });
            onDataReceived(response.data);
            setQueryTimestamp(new Date().toISOString());
            setJsonData(JSON.stringify(response.data, null, 2));
            setOutputMessage({
                message: 'Data fetched successfully',
                class: 'success',
            });
        } catch (error) {
            console.log('error!');
            console.error(error);
            let errorMessage = 'An error occured while fetching data';
            if (error.message && error.code) {
                errorMessage = `${error.code} - ${error.message}. Please check the parameter values are correct.`;
            }
            setOutputMessage({
                message: errorMessage,
                class: 'danger',
            });
            setJsonData('');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Form className="m-3 api-form mx-auto">
            <Form.Group as={Row} className="mb-3" controlId="formEndpoint">
                <Form.Label column sm="2">
                    Endpoint
                </Form.Label>
                <Col sm="10">
                    <InputGroup className="mb-3 dropdown-button-custom">
                        <DropdownButton
                            variant={endpoint ? 'light' : 'primary'}
                            title={
                                endpointText ? endpointText : 'Select endpoint'
                            }
                        >
                            {apiEndpoints.map((endpoint, i) => (
                                <Dropdown.Item
                                    key={i}
                                    onClick={() => {
                                        setEndpointHelper(
                                            endpoint.url,
                                            endpoint.text,
                                        );
                                    }}
                                >
                                    {endpoint.text}
                                </Dropdown.Item>
                            ))}
                        </DropdownButton>
                        <Form.Control
                            aria-label="Text input with dropdown button"
                            ref={endpointRef}
                            readOnly
                            value={`${baseApiUrl}${endpoint}`}
                        />
                    </InputGroup>
                </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3" controlId="formApiKey">
                <Form.Label column sm="2">
                    API Key
                </Form.Label>
                <Col sm="10">
                    <Form.Control
                        placeholder="..."
                        value={pathParams.apiKey}
                        ref={apikeyRef}
                        onChange={(e) =>
                            setPathParams({
                                ...pathParams,
                                apiKey: e.target.value,
                            })
                        }
                    />
                </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3" controlId="formStationId">
                <Form.Label column sm="2">
                    Station ID
                </Form.Label>
                <Col sm="5">
                    <Form.Control
                        placeholder="..."
                        ref={stationIdRef}
                        value={pathParams.stationId}
                        onChange={(e) =>
                            setPathParams({
                                ...pathParams,
                                stationId: e.target.value,
                            })
                        }
                    />
                </Col>
                <Form.Label column sm="1">
                    Unit
                </Form.Label>
                <Col sm="4">
                    <Form.Select
                        value={pathParams.unit}
                        ref={unitRef}
                        onChange={(e) =>
                            setPathParams({
                                ...pathParams,
                                unit: e.target.value,
                            })
                        }
                    >
                        <option hidden disabled value="">
                            Select...
                        </option>
                        {units.map((unit, i) => (
                            <option key={i} value={unit.value}>
                                {unit.displayText}
                            </option>
                        ))}
                    </Form.Select>
                </Col>
            </Form.Group>

            <Form.Group
                as={Row}
                className="mb-3"
                controlId="formRememberParams"
            >
                <Col sm={12}>
                    <Form.Check
                        type="checkbox"
                        label="Remember base parameters"
                        checked={rememberMe}
                        onChange={(e) => setRememberMeHelper(e.target.checked)}
                        className="right-align-checkbox"
                    />
                </Col>
            </Form.Group>

            {isParamInEndpoint('numericPrecision') && (
                <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm="2" className="input-label">
                        Numeric Precision
                    </Form.Label>
                    <Col sm="5">
                        <Form.Select
                            className="input-field"
                            value={apiParams.numericPrecision}
                            onChange={(e) => {
                                setApiParams({
                                    ...apiParams,
                                    numericPrecision: e.target.value,
                                });
                            }}
                        >
                            <option value="decimal">Decimal</option>
                            <option value="">Integer</option>
                        </Form.Select>
                    </Col>
                </Form.Group>
            )}

            <Form.Group className="d-flex justify-content-center">
                <Button
                    variant="success"
                    onClick={fetchData}
                    disabled={isLoading}
                    style={{ width: '200px' }}
                >
                    {isLoading ? (
                        <>
                            <FontAwesomeIcon icon={faSpinner} spin /> Loading
                        </>
                    ) : (
                        'Fetch Data'
                    )}
                </Button>
            </Form.Group>

            <Form.Group className="mt-2 text-center">
                <Form.Label className={outputMessage.class}>
                    {outputMessage.message}
                </Form.Label>
            </Form.Group>

            <hr />

            <Form.Group>
                <Row>
                    <Col>
                        <Form.Label>Results</Form.Label>
                    </Col>
                </Row>
                <Row style={{ marginTop: '-15px' }}>
                    <Col>
                        <Form.Label
                            className="text-muted"
                            style={{ fontSize: '0.8rem', fontStyle: 'italic' }}
                        >
                            {queryTimestamp &&
                                `(query completed ${queryTimestamp})`}
                        </Form.Label>
                    </Col>
                </Row>
                <Row>
                    <Form.Control
                        as="textarea"
                        className="monospace"
                        readOnly
                        value={jsonData ? jsonData : 'No output to display'}
                        rows={jsonData ? 20 : 5}
                    />
                </Row>
            </Form.Group>

            <div style={{ display: 'none' }}>
                <hr />
                <b>debugging</b>
                <br />
                <label>endpoint: {endpoint}</label>
                <br />
                <label>endpointText: {endpointText}</label>
                <br />
                {Object.entries(pathParams).map(([key, value]) => (
                    <div key={key}>
                        <label>
                            {key}: {value}
                        </label>
                        <br />
                    </div>
                ))}
                <label>outputMessage: {JSON.stringify(outputMessage)}</label>
                <br />
                <label>apiParams: {JSON.stringify(apiParams)}</label>
                <br />
            </div>
        </Form>
    );
};

// chrome://flags/#block-insecure-private-network-requests

export default ApiCaller;
