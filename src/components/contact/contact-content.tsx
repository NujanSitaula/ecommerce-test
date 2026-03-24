import { useEffect, useMemo, useState } from 'react';
import { TiPencil } from 'react-icons/ti';
import { IoMdClose } from 'react-icons/io';
import { AiOutlinePlus } from 'react-icons/ai';
import { Description, Label, Radio, RadioGroup } from '@headlessui/react';
import { useModalAction } from '@components/common/modal/modal.context';
import { useTranslation } from 'src/app/i18n/client';
import {
  useCreateOrUpdateContactNumberMutation,
  useDeleteContactNumberMutation,
} from '@framework/contact/contact';

const ContactBox: React.FC<{
  contacts?: any[];
  lang: string;
  onSelect?: (contactId: number) => void;
  selectedContactNumberId?: number | null;
}> = ({ contacts = [], lang, onSelect, selectedContactNumberId = null }) => {
  const { t } = useTranslation(lang, 'common');
  const { openModal } = useModalAction();
  const { mutateAsync: saveContact } = useCreateOrUpdateContactNumberMutation();
  const { mutateAsync: deleteContact } = useDeleteContactNumberMutation();

  const primary = useMemo(
    () => contacts.find((c) => c.is_default) || contacts[0],
    [contacts],
  );
  const [selectedId, setSelectedId] = useState<number | null>(
    selectedContactNumberId ?? null,
  );

  useEffect(() => {
    const nextId = selectedContactNumberId ?? primary?.id ?? null;
    setSelectedId(nextId);
  }, [selectedContactNumberId, primary?.id]);

  function handleAdd(contact?: any) {
    openModal('PHONE_NUMBER', contact);
  }

  async function handleSelect(contact: any) {
    setSelectedId(contact.id);
    await saveContact({
      id: contact.id,
      title: contact.title,
      phone: contact.phone,
      is_default: true,
    });
    if (onSelect) {
      onSelect(contact.id);
    }
  }

  async function handleDelete(contact: any) {
    const result = confirm(
      `${t('text-delete-confirm') || 'Delete'} ${contact.title || ''}`.trim(),
    );
    if (result) {
      await deleteContact(contact.id);
    }
  }

  return (
    <div className="text-[15px] text-brand-dark">
      <RadioGroup
        value={selectedId}
        onChange={(value) => {
          const match = contacts.find((c) => c.id === value);
          if (match) handleSelect(match);
        }}
        className="grid grid-cols-1 gap-5 md:grid-cols-2 auto-rows-auto"
      >
        <Label className="sr-only">{t('text-default')}</Label>
        {contacts.map((item) => (
          <Radio
            key={item.id}
            value={item.id}
            className={({ checked }) =>
              `${checked ? 'border-brand' : 'border-border-base'}
              border-2 relative focus:outline-none rounded p-5 block cursor-pointer min-h-[112px] h-full group address__box`
            }
          >
            <Label as="h2" className="mb-2 font-semibold">
              {item?.title || t('text-contact-number')}
            </Label>
            <Description as="div" className="opacity-70">
              {item?.phone}
            </Description>
            <div className="absolute z-30 flex transition-all ltr:right-3 rtl:left-3 top-3 lg:opacity-0 address__actions gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleAdd(item);
                }}
                className="flex items-center justify-center w-6 h-6 text-base rounded-full bg-brand text-brand-light text-opacity-80"
              >
                <TiPencil />
              </button>
              <button
                className="flex justify-center items-center bg-[#F35C5C] h-5 w-5 rounded-full"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(item);
                }}
              >
                <IoMdClose size={12} fill={'#fff'} />
              </button>
            </div>
          </Radio>
        ))}
        <button
          className="border-2 transition-all border-border-base rounded font-semibold p-5 px-10 cursor-pointer text-brand flex justify-start hover:border-brand items-center min-h-[112px] h-full"
          onClick={() => handleAdd()}
        >
          <AiOutlinePlus size={18} className="ltr:mr-2 rtl:ml-2" />
          {t('text-add-phone-number')}
        </button>
      </RadioGroup>
    </div>
  );
};

export default ContactBox;

function CheckIcon(props: any) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <circle cx={12} cy={12} r={12} fill="#fff" opacity="0.2" />
      <path
        d="M7 13l3 3 7-7"
        stroke="#fff"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
