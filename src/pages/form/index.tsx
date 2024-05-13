import { Button, SearchSelect, TextField } from '@/components';
import { Footer, Layout } from '@/container';
import * as Yup from 'yup';
import { educationLevel, genderData, locationData } from '@/static-data';
import { supabase } from '@/utils/supabase';
import { Formik, Form as FormikForm } from 'formik';
import React from 'react';
import { IoIosPlay } from 'react-icons/io';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import toastAlert from '@/utils/toastAlert';

interface IProps {}

interface FormValue {
  birthdate: string;
  location: string;
  sex: string;
  education: string;
}

const FORM_VALIDATION = Yup.object().shape({
  birthdate: Yup.string().required('Birthdate is required'),
  location: Yup.string().required('Required'),
  sex: Yup.string().required('Required'),
  education: Yup.string().required('Required'),
});

const Form: React.FC<IProps> = ({}) => {
  const navigate: NavigateFunction = useNavigate();
  const initValues = {
    birthdate: '',
    location: '',
    sex: '',
    education: '',
  };
  const handleSubmit = async (val: FormValue) => {
    const { birthdate, education, location, sex } = val;
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
      navigate('/question');
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
            <TextField name="birthdate" type="date" label="Data nasterii" />
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
                <Button
                  text="Back"
                  type="button"
                  variant="outline"
                  className="px-4 py-2"
                />

                <Button
                  text="Submit"
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
