import * as React from 'react';
import * as Yup from 'yup';
import { Formik, Form as FormikForm } from 'formik';
import { Link, NavigateFunction, useNavigate } from 'react-router-dom';
import { IoIosPlay } from 'react-icons/io';
import { Button, DateInputMask, SearchSelect } from '@/components';
import { Footer, Layout } from '@/container';
import { educationLevel, genderData, locationData } from '@/static-data';
import { supabase } from '@/utils/supabase';
import toastAlert from '@/utils/toastAlert';
import calculateAge from '@/utils/calculate-age';

interface FormValue {
  birthdate: string;
  location: string;
  sex: string;
  education: string;
}

const FORM_VALIDATION = Yup.object().shape({
  birthdate: Yup.string()
    .matches(
      /^\d{2}-\d{2}-\d{4}$/,
      'Data nașterii trebuie să fie în formatul zz-ll-aaaa'
    )
    .required('Data nașterii este obligatorie'),
  location: Yup.string()
    .required('')
    .test('location', 'locație nevalidă', (value) => {
      if (
        value?.trim() ===
        'Domiciliul din cartea de identitate nu este in Bucuresti'
      ) {
        return false;
      }
      return true;
    }),
  sex: Yup.string().required(''),
  education: Yup.string().required(''),
});

const Form: React.FC = () => {
  const navigate: NavigateFunction = useNavigate();

  const initValues = {
    birthdate: '',
    location: '',
    sex: '',
    education: '',
  };
  const handleSubmit = async (val: FormValue) => {
    const { birthdate, education, location, sex } = val;
    if (calculateAge(birthdate) < 18) {
      navigate('/age-error');
      return;
    }
    const { data, error } = await supabase
      .from('user')
      .insert({
        birthdate,
        location,
        education,
        sex,
      })
      .select();
    if (data) {
      navigate('/question', { state: { userId: data[0]?.id } });
    }
    if (error) {
      toastAlert('error', 'Something went wrong');
    }
  };

  return (
    <Layout title="Formular">
      <Formik
        initialValues={initValues}
        onSubmit={handleSubmit}
        validateOnMount
        validationSchema={FORM_VALIDATION}
      >
        {({ isSubmitting, isValid }) => (
          <FormikForm>
            <DateInputMask name="birthdate" label="Data nasterii" isPrimary />

            <SearchSelect
              name="location"
              options={locationData ?? []}
              label="Unde este domiciliul dumneavoastra din cartea de identitate?"
              placeholder="Select"
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
              label="Ce studii ati absolvit?"
              placeholder="Select"
            />
            <Footer>
              <div className="flex items-center gap-3 mt-4 justify-end ">
                <Link to="/demo" className="w-full">
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
