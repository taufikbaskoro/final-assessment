import Button from '@common_button';
import PasswordField from '@common_password';
import Select from '@common_select';
import TextField from '@common_textfield';
import Typography from '@common_typography';
import useStyles from '@core_modules/register/pages/default/components/style';
import DateDayJs from '@date-io/dayjs';
import { breakPointsUp } from '@helper_theme';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import OtpBlock from '@plugin_otp';
import classNames from 'classnames';
import ReCAPTCHA from 'react-google-recaptcha';
import Hero from '@common_image';

const RegisterView = ({
    t,
    formik,
    enableOtp,
    setdisabled,
    handleChangePhone,
    handleWa,
    handleChangeDate,
    phoneIsWa,
    enableRecaptcha,
    sitekey,
    handleChangeCaptcha,
    disabled,
    recaptchaRef,
    gender,
    dob,
}) => {
    const styles = useStyles();
    const desktop = breakPointsUp('sm');
    // console.log(enableRecaptcha);
    return (
        <div className={classNames('row')}>
            <form className={classNames('col-md-6', styles.container)} onSubmit={formik.handleSubmit}>
                <div className={classNames(styles.formPart)}>
                    <Typography className={classNames(styles.noMargin)} variant="h1" type="bold">Sign Up Account</Typography>
                    <Typography className={classNames(styles.noMargin)} variant="p">Sign up account to get an excellent shopping experience</Typography>
                </div>
                <Typography className={classNames(styles.noMargin)} variant="h2" type="bold">Customer Name</Typography>
                <TextField
                    variant={"outlined"}
                    className={styles.marginBottom}
                    placeholder={t('common:form:firstName')}
                    name="firstName"
                    value={formik.values.firstName}
                    onChange={formik.handleChange}
                    error={!!(formik.touched.firstName && formik.errors.firstName)}
                    errorMessage={(formik.touched.firstName && formik.errors.firstName) || null}
                />
                <TextField
                    variant={"outlined"}
                    className={classNames(styles.formPart)}
                    placeholder={t('common:form:lastName')}
                    name="lastName"
                    value={formik.values.lastName}
                    onChange={formik.handleChange}
                    error={!!(formik.touched.lastName && formik.errors.lastName)}
                    errorMessage={(formik.touched.lastName && formik.errors.lastName) || null}
                />
                <Typography className={classNames(styles.noMargin)} variant="h2" type="bold">Login Information</Typography>
                <TextField
                    variant={"outlined"}
                    className={styles.marginBottom}
                    placeholder="Email"
                    type="email"
                    name="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    error={!!(formik.touched.email && formik.errors.email)}
                    errorMessage={(formik.touched.email && formik.errors.email) || null}
                />
                {gender && (
                    <Select
                        className="genderField"
                        options={[{ label: 'Male', value: 1 }, { label: 'Female', value: 2 }]}
                        label={t('common:form:gender')}
                        name="gender"
                        value={formik.values.gender}
                        onChange={formik.handleChange}
                        helperText={t('common:form:select')}
                        error={!!(formik.touched.gender && formik.errors.gender)}
                        errorMessage={(formik.touched.gender && formik.errors.gender) || null}
                    />
                )}
                {dob && (
                    <DatePicker
                        fullWidth
                        label={t('common:form:dob')}
                        name="dob"
                        value={formik.values.dob}
                        onChange={handleChangeDate}
                        error={!!(formik.touched.dob && formik.errors.dob)}
                        helperText={(formik.touched.dob && formik.errors.dob) || null}
                    />
                )}
                <PasswordField
                    variant={"outlined"}
                    className={styles.marginBottom, styles.noMargin}
                    placeholder="Password"
                    label={''}
                    showVisible
                    showPasswordMeter
                    name="password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    error={!!(formik.touched.password && formik.errors.password)}
                    errorMessage={(formik.touched.password && formik.errors.password) || null}
                />
                <TextField
                    variant={"outlined"}
                    className={styles.marginBottom, styles.noMargin}
                    placeholder={t('common:form:confirm')}
                    type="password"
                    name="confirmPassword"
                    value={formik.values.confirmPassword}
                    onChange={formik.handleChange}
                    error={!!(formik.touched.confirmPassword && formik.errors.confirmPassword)}
                    errorMessage={(formik.touched.confirmPassword && formik.errors.confirmPassword) || null}
                />
                {enableOtp ? (
                    <>
                        <OtpBlock
                            type="register"
                            setDisabled={setdisabled}
                            phoneProps={{
                                name: 'phoneNumber',
                                value: formik.values.phoneNumber,
                                onChange: handleChangePhone,
                                error: !!(formik.errors.phoneNumber && formik.touched.phoneNumber),
                                errorMessage: (formik.touched.phoneNumber && formik.errors.phoneNumber) || null,
                            }}
                            codeProps={{
                                name: 'otp',
                                value: formik.values.otp,
                                onChange: formik.handleChange,
                                error: !!(formik.touched.otp && formik.errors.otp),
                                errorMessage: (formik.touched.otp && formik.errors.otp) || null,
                                footer: (
                                    <FormControlLabel
                                        onChange={handleWa}
                                        className={styles.checkWa}
                                        control={<Checkbox name="whastapptrue" color="primary" size="small" />}
                                        label={<Typography variant="p">{t('register:isWhatsapp')}</Typography>}
                                    />
                                ),
                            }}
                        />
                        {!phoneIsWa && (
                            <TextField
                                label={`${t('common:form:phoneNumber')} Whatsapp`}
                                name="whatsappNumber"
                                value={formik.values.whatsappNumber}
                                onChange={formik.handleChange}
                                error={!!(formik.touched.whatsappNumber && formik.errors.whatsappNumber)}
                                errorMessage={(formik.touched.whatsappNumber && formik.errors.whatsappNumber) || null}
                            />
                        )}
                    </>
                ) : null}
                <div className={styles.footer}>
                    <FormControlLabel
                        value={formik.values.subscribe}
                        onChange={formik.handleChange}
                        name="subscribe"
                        control={<Checkbox name="subscribe" color="primary" size="small" />}
                        label={(
                            <>
                            <Typography variant="span" letter="capitalize" type="bold" className="row center">
                                {t('register:subscribe')}
                            </Typography>
                            <Typography variant="p">{t('register:subscribeDesc')}</Typography>
                            </>
                        )}
                        className={enableRecaptcha && styles.subscribe}
                    />

                    {
                        enableRecaptcha ? (
                            <>
                                <ReCAPTCHA
                                    sitekey={sitekey}
                                    onChange={handleChangeCaptcha}
                                    ref={recaptchaRef}
                                />
                                { formik.errors.captcha && (
                                    <Typography color="red">{formik.errors.captcha}</Typography>
                                )}
                            </>
                        ) : null
                    }
                    <Button
                        disabled={disabled}
                        fullWidth={true}
                        className={styles.btnSigin}
                        type="submit"
                        align={'center'}
                    >
                        <Typography variant="h2" type="bold" letter="uppercase" color="white">
                            {t('register:button')}
                        </Typography>
                    </Button>
                </div>
            </form>
            <div className={classNames('col-md-6', styles.hero)}>
                <Hero src={''} width={673} height={766}  />
            </div>
        </div>
    );
};

const RegisterViewProvider = (props) => (
    <MuiPickersUtilsProvider utils={DateDayJs}>
        <RegisterView {...props} />
    </MuiPickersUtilsProvider>
);

export default RegisterViewProvider;
