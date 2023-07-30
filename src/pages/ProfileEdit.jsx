import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { getUser, updateUser } from '../services/userAPI';
import Header from '../components/Header';

class ProfileEdit extends Component {
  state = {
    user: {
      name: '',
      email: '',
      description: '',
      image: '',
    },
    isLoading: true,
    isSaveButtonEnabled: false,
  };

  async componentDidMount() {
    try {
      const user = await getUser();
      this.setState({ user, isLoading: false });
    } catch (error) {
      console.error('Erro ao carregar informações do usuário:', error);
    }
  }

  handleChange = ({ target }) => {
    const { name, value } = target;
    this.setState(
      (prevState) => ({
        user: {
          ...prevState.user,
          [name]: value,
        },
      }),
      this.checkSaveButtonStatus,
    );
  };

  checkSaveButtonStatus = () => {
    const { user } = this.state;
    const { name, email, description, image } = user;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isSaveButtonEnabled = name.trim()
    && email.trim() && description.trim() && image.trim() && emailPattern.test(email);
    this.setState({ isSaveButtonEnabled });
  };

  handleSave = async () => {
    const { user, isSaveButtonEnabled } = this.state;
    const { name, email, description, image } = user;
    const { history } = this.props;

    // Verifica se o botão de salvar está habilitado
    if (!isSaveButtonEnabled) {
      return;
    }

    // Desabilita o botão de salvar durante a atualização
    this.setState({ isLoading: true });

    // Atualiza o perfil do usuário
    try {
      await updateUser({ name, email, description, image });
      // Redireciona para a página de exibição de perfil após a edição
      history.push('/profile');
    } catch (error) {
      console.error('Erro ao atualizar perfil do usuário:', error);
    } finally {
      this.setState({ isLoading: false });
    }
  };

  render() {
    const { user, isLoading, isSaveButtonEnabled } = this.state;
    const { name, email, description, image } = user;

    return (
      <div data-testid="page-profile-edit">
        <Header />
        {isLoading ? (
          <p>Carregando...</p>
        ) : (
          <form>
            <label htmlFor="name">
              Nome:
              <input
                id="name"
                type="text"
                name="name"
                value={ name }
                onChange={ this.handleChange }
                data-testid="edit-input-name"
                required
              />
            </label>
            <br />
            <label htmlFor="email">
              Email:
              <input
                id="email"
                type="email"
                name="email"
                value={ email }
                onChange={ this.handleChange }
                data-testid="edit-input-email"
                required
              />
            </label>
            <br />
            <label htmlFor="description">
              Descrição:
              <textarea
                id="description"
                name="description"
                value={ description }
                onChange={ this.handleChange }
                data-testid="edit-input-description"
                required
              />
            </label>
            <br />
            <label htmlFor="image">
              Foto:
              <input
                id="image"
                type="url"
                name="image"
                value={ image }
                onChange={ this.handleChange }
                data-testid="edit-input-image"
                required
              />
            </label>
            <br />
            <button
              type="button"
              onClick={ this.handleSave }
              data-testid="edit-button-save"
              disabled={ !isSaveButtonEnabled }
            >
              Salvar
            </button>
          </form>
        )}
      </div>
    );
  }
}

ProfileEdit.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
}.isRequired;

export default ProfileEdit;
