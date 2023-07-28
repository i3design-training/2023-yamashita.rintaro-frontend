import * as yup from 'yup';
import {
  PasswordMinLength,
  UsernameMaxLength,
  UsernameMinLength,
} from '../constants/formConstants';

export const loginSchema = yup
  .object({
    // Yupのemail()メソッドは、入力された文字列が有効なメールアドレスの形式であることを自動的に検証
    email: yup
      .string()
      .required('メールアドレスは必須です')
      .email('有効なメールアドレスを入力してください'),
    password: yup
      .string()
      .required('パスワードは必須です')
      .min(PasswordMinLength, 'パスワードは最低8文字必要です')
      .matches(
        // 少なくとも1つの小文字が含まれていること：(?=.*[a-z])
        // 少なくとも1つの大文字が含まれていること：(?=.*[A-Z])
        // 少なくとも1つの数字が含まれていること：(?=.*\\d)
        // パスワードの長さが指定した最小文字数以上であること：[a-zA-Z\\d]{${PasswordMinLength},}$
        new RegExp(
          `^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{${PasswordMinLength},}$`,
        ),
        `パスワードは最低1つの大文字、1つの小文字、1つの数字を含む${PasswordMinLength}文字以上が必要です`,
      ),
  })
  .required();

export const userRegistrationSchema = yup
  .object({
    username: yup
      .string()
      .required('ユーザー名は必須です')
      .min(UsernameMinLength, 'ユーザー名は最低3文字必要です')
      .max(UsernameMaxLength, 'ユーザー名は最大20文字までです'),
    // Yupのemail()メソッドは、入力された文字列が有効なメールアドレスの形式であることを自動的に検証
    email: yup
      .string()
      .required('メールアドレスは必須です')
      .email('有効なメールアドレスを入力してください'),
    password: yup
      .string()
      .required('パスワードは必須です')
      .min(PasswordMinLength, 'パスワードは最低8文字必要です')
      .matches(
        // 少なくとも1つの小文字が含まれていること：(?=.*[a-z])
        // 少なくとも1つの大文字が含まれていること：(?=.*[A-Z])
        // 少なくとも1つの数字が含まれていること：(?=.*\\d)
        // パスワードの長さが指定した最小文字数以上であること：[a-zA-Z\\d]{${PasswordMinLength},}$
        new RegExp(
          `^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{${PasswordMinLength},}$`,
        ),
        `パスワードは最低1つの大文字、1つの小文字、1つの数字を含む${PasswordMinLength}文字以上が必要です`,
      ),
  })
  .required();
