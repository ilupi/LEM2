package hu.grapes.me.lem;

import com.badlogic.gdx.ApplicationListener;
import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.graphics.GL10;
import com.badlogic.gdx.graphics.OrthographicCamera;
import com.badlogic.gdx.graphics.Texture;
import com.badlogic.gdx.graphics.g2d.Sprite;
import com.badlogic.gdx.graphics.g2d.SpriteBatch;

public class LEMGame extends LEMBase implements ApplicationListener {
	private OrthographicCamera camera;
	private SpriteBatch batch;
	
	@Override
	public void create() {		
		float w = 960;
		float h = 540;
		
		
		camera = new OrthographicCamera();
		camera.setToOrtho(false, w, h);
		batch = new SpriteBatch();
		
		//--- Image, X, Y, Width, Height
		addSprite("Main_Background", "images/hu/Background_Samsung_960.jpg", 0, 0, 960, 540);
		setSource("Main_Background", "images/hu/BetHistoryBackground_Samsung_960.jpg", 960, 540);
		
		setPosition("Main_Background", 0, 0);
		hide("Main_Background");
		show("Main_Background");
	}




	@Override
	public void dispose() {
		batch.dispose();
		for (LEMSprite lem : objects.values()) {
			lem.texture.dispose();
		}
		
	}

	@Override
	public void render() {		
		Gdx.gl.glClearColor(1, 1, 1, 1);
		Gdx.gl.glClear(GL10.GL_COLOR_BUFFER_BIT);
		
		batch.setProjectionMatrix(camera.combined);
		batch.begin();
		
		for (LEMSprite lem : objects.values()) {
			
			if (lem.visible == true) {
				lem.sprite.draw(batch);
			}
		}
		
		
		batch.end();
	}

	@Override
	public void resize(int width, int height) {
	}

	@Override
	public void pause() {
	}

	@Override
	public void resume() {
	}
}
