/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/label-has-associated-control */
import * as React from 'react';
import * as Yup from 'yup';
import { Field, Formik, Form as FormikForm } from 'formik';
import {
  Link,
  NavigateFunction,
  useNavigate,
  useLocation,
} from 'react-router-dom';
import { IoIosPlay } from 'react-icons/io';
import { Button, DateInputMask, SearchSelect, TextField } from '@/components';
import { Footer, Layout } from '@/container';
import { educationLevel, genderData } from '@/static-data';
import { supabase } from '@/utils/supabase';
import toastAlert from '@/utils/toastAlert';
import calculateAge from '@/utils/calculate-age';

interface Option {
  label: string;
  value: string;
}

interface FormValue {
  birthdate: string;
  location: string;
  sex: Option;
  education: Option;
  checked: boolean;
}

const FORM_VALIDATION = Yup.object().shape({
  birthdate: Yup.string()
    .matches(
      /^\d{2}-\d{2}-\d{4}$/,
      'Data nașterii trebuie să fie în formatul zz-ll-aaaa'
    )
    .required('Data nașterii este obligatorie'),
  location: Yup.string().required('Localitatea este necesară'),
  sex: Yup.object()
    .shape({
      label: Yup.string().required('Sexul este necesar'),
      value: Yup.string().required('Sexul este necesar'),
    })
    .required('Sexul este necesar'),
  education: Yup.object()
    .shape({
      label: Yup.string().required('Educația este necesară'),
      value: Yup.string().required('Educația este necesară'),
    })
    .required('Educația este necesară'),
  checked: Yup.bool().oneOf(
    [true],
    'Trebuie să acceptați termenii și condițiile'
  ),
});

const Form: React.FC = () => {
  const navigate: NavigateFunction = useNavigate();
  const locationParams = useLocation();

  const initValues = {
    birthdate: '',
    location: '',
    sex: '',
    education: '',
    checked: false,
  };

  const saveFormValues = (values: FormValue) => {
    localStorage.setItem('formValues', JSON.stringify(values));
  };

  const loadFormValues = (): FormValue => {
    const savedValues = localStorage.getItem('formValues');
    return savedValues ? JSON.parse(savedValues) : initValues;
  };

  const clearFormValues = () => {
    localStorage.removeItem('formValues');
  };

  const handleSubmit = async (val: FormValue) => {
    const { birthdate, education, location, sex } = val;

    if (calculateAge(birthdate) < 18) {
      navigate('/age-error', { state: 'age-error' });
      return;
    }

    if (
      location === 'Domiciliul din cartea de identitate nu este in Bucuresti'
    ) {
      navigate('/age-error', { state: 'location-error' });
      return;
    }
    const { data, error } = await supabase
      .from('user')
      .insert({
        birthdate,
        location,
        education: education.value,
        sex: sex.value,
      })
      .select();
    if (data) {
      clearFormValues();
      navigate('/question', { state: { userId: data[0]?.id } });
    }
    if (error) {
      toastAlert('error', 'Something went wrong');
    }
  };

  React.useEffect(() => {
    if (locationParams.pathname === '/terms-conditions') {
      const savedValues = loadFormValues();
      if (savedValues) {
        saveFormValues(savedValues);
      }
    } else {
      clearFormValues();
    }
  }, [locationParams.pathname]);

  return (
    <Layout title="Formular">
      <Formik
        initialValues={loadFormValues()}
        onSubmit={handleSubmit}
        validateOnMount
        validationSchema={FORM_VALIDATION}
        enableReinitialize
      >
        {({ values, isSubmitting, isValid }) => (
          <FormikForm>
            <DateInputMask name="birthdate" label="Data nasterii" isPrimary />
            <TextField
              name="location"
              label="În ce localitate este domiciliul dumneavoastră din cartea de identitate?"
              placeholder="Ex: București"
            />

            <SearchSelect
              name="sex"
              options={genderData ?? []}
              label="Care este sexul dumneavoastra, asa cum este trecut in cartea de identitate?"
              placeholder="Select"
            />
            <SearchSelect
              name="education"
              options={educationLevel ?? []}
              label="Care este cea mai înaltă formă de educație absolvită?"
              placeholder="Select"
            />
            <div className="flex items-center">
              <Field
                type="checkbox"
                name="checked"
                required
                className="form-checkbox-custom peer"
              />
              <label className="ml-4 text-xs" htmlFor="checked">
                Declar că sunt de acord cu înregistrarea răspunsurilor mele text
                și video și cu prelucrarea datelor mele personale în scopul
                extragerii informațiilor necesare sondajului. Am citit și
                înțeles termenii și condițiile și politica de confidențialitate
                ale INTERSPECT.
              </label>
            </div>
            <Link
              to="/terms-conditions"
              className="mt-5 block text-center text-sm font-normal text-[blue]"
              onClick={() => saveFormValues(values)}
            >
              Termeni și condiții, Politica de confidențialitate INTERSPECT
            </Link>

            <Footer>
              <div className="mt-4 flex items-center justify-end gap-3">
                <Link to="/" className="w-full">
                  <Button
                    text="Înapoi"
                    type="button"
                    variant="outline"
                    className="px-4 py-2"
                  />
                </Link>

                <Button
                  text="Trimite"
                  type="submit"
                  variant="primary"
                  icon={<IoIosPlay size={20} color="#fff" />}
                  className="px-4 py-2"
                  hasIcon
                  isSubmitting={isSubmitting}
                  isValid={isValid}
                />
              </div>
            </Footer>
          </FormikForm>
        )}
      </Formik>
    </Layout>
  );
};

export default React.memo(Form);
