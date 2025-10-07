import * as Contacts from 'expo-contacts';

export async function requestContactsPermission(): Promise<boolean> {
  const { status } = await Contacts.requestPermissionsAsync();
  return status === 'granted';
}

export async function getContacts() {
  const hasPermission = await requestContactsPermission();

  if (!hasPermission) {
    throw new Error('Contacts permission denied');
  }

  const { data } = await Contacts.getContactsAsync({
    fields: [Contacts.Fields.PhoneNumbers, Contacts.Fields.Emails],
  });

  return data;
}

