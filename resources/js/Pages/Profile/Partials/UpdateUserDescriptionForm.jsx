import React, {useState, useEffect, useRef} from 'react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import Textarea from '@/Components/Textarea';
import { useForm, usePage } from '@inertiajs/react';
import { Transition } from '@headlessui/react';
import WysiwygEditor from '@/Components/WysiwygEditor';
import { EditorState, convertToRaw, convertFromRaw } from 'draft-js';

const UpdateUserDescriptionForm = ({ className = '' }) => {
    const user = usePage().props.auth.user;
    const [errorInput, setErrorInput] = useState({});
    const [frEditorState, setFrEditorState] = useState(() => {
        if (user.fr_description) {
            const contentState = convertFromRaw(JSON.parse(user.fr_description));
            return EditorState.createWithContent(contentState);
        } else {
            return EditorState.createEmpty();
        }
    });

    const [enEditorState, setEnEditorState] = useState(() => {
        if (user.en_description) {
            const contentState = convertFromRaw(JSON.parse(user.en_description));
            return EditorState.createWithContent(contentState);
        } else {
            return EditorState.createEmpty();
        }
    });
    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm({
        name: user.name,
        email: user.email,
        en_description: user.en_description,
        fr_description: user.fr_description,
    });

    const submit = (e) => {
        e.preventDefault();

        patch(route('profile.update'), {
            onSuccess: () => {
                console.log('Profile updated successfully.');
            },
            onError: (error) => {
                console.error('Profile update failed:', error);
            }
        });
    };


    const handleBlurOnRichEditor = (e) => {
        if(e.target.textContent.length === 0) {
            setErrorInput({
                ...errorInput,
                description: {
                    message: 'Une description est requise',
                    status: true
                }
            })
        } else {
            setErrorInput({
                ...errorInput,
                description: {
                    message: '',
                    status: false
                }
            })
        }
    }

    const handleFrEditorStateChange = (editorState) => {
        const contentState = frEditorState.getCurrentContent();
        const rawContentState = convertToRaw(contentState);
        setData('fr_description', JSON.stringify(rawContentState));
        setFrEditorState(editorState);
    }

    const handleEnEditorStateChange = (editorState) => {
        const contentState = enEditorState.getCurrentContent();
        const rawContentState = convertToRaw(contentState);
        setData('en_description', JSON.stringify(rawContentState));
        setEnEditorState(editorState);
    }

  return (
    <section className={className}>
        <header>
            <h2 className="text-lg font-medium text-gray-900">Update Description</h2>

            <p className="mt-1 text-sm text-gray-600">
            Update your account's description in English and French.
            </p>
        </header>

        <form onSubmit={submit} className="mt-6 space-y-6">
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <InputLabel htmlFor="en_description" value="English Description" />
                    <WysiwygEditor handleEditorStateChange={handleEnEditorStateChange} id="en_description" editorState={enEditorState} onBlur={handleBlurOnRichEditor} />
                    <InputError className="mt-2" message={errors.en_description} />
                </div>

                <div>
                    <InputLabel htmlFor="fr_description" value="French Description" />
                    <WysiwygEditor handleEditorStateChange={handleFrEditorStateChange} id="fr_description" editorState={frEditorState} onBlur={handleBlurOnRichEditor} />
                    <InputError className="mt-2" message={errors.fr_description} />
                </div>
            </div>

            <div className="flex items-center gap-4">

                <PrimaryButton disabled={processing}>Save</PrimaryButton>

                <Transition
                    show={recentlySuccessful}
                    enter="transition ease-in-out"
                    enterFrom="opacity-0"
                    leave="transition ease-in-out"
                    leaveTo="opacity-0"
                >
                    <p className="text-sm text-gray-600">Saved.</p>
                </Transition>
            </div>
        </form>
    </section>
  )
}

export default UpdateUserDescriptionForm