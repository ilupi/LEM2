package hu.grapes.me.lem;

import java.util.HashMap;

import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.graphics.Texture;
import com.badlogic.gdx.graphics.Texture.TextureFilter;
import com.badlogic.gdx.graphics.g2d.Sprite;
import com.badlogic.gdx.graphics.g2d.TextureRegion;

public class LEMBase {
	
	protected HashMap<String, LEMSprite> objects = new HashMap<String, LEMSprite>();

	protected void addSprite(String name, String image, int x, int y, int w, int h) {
		
		y = 540 - y - h;
		
		Texture texture = new Texture(Gdx.files.internal(image));
		texture.setFilter(TextureFilter.Linear, TextureFilter.Linear);
		
		TextureRegion region = new TextureRegion(texture, 0, 0, w, h);
		
		Sprite sprite = new Sprite(region);
		sprite.setSize(w, h);
		sprite.setOrigin(0, 0);
		sprite.setPosition(x, y);
		
		LEMSprite lem = new LEMSprite();
		lem.sprite = sprite;
		lem.texture = texture;
		
		objects.put(name, lem);
	}
	
	public void setPosition(String name, int x, int y) {
		LEMSprite lem = objects.get(name);
		if (lem == null) {
			return;
		}
		y = (int)(540 - y - lem.sprite.getHeight());
		lem.sprite.setPosition(x, y);
	}
	
	public void setY(String name, int y) {
		LEMSprite lem = objects.get(name);
		if (lem == null) {
			return;
		}
		y = (int)(540 - y - lem.sprite.getHeight());
		lem.sprite.setPosition(lem.sprite.getX(), y);
	}
	
	public void setX(String name, int x) {
		LEMSprite lem = objects.get(name);
		if (lem == null) {
			return;
		}
		
		lem.sprite.setPosition(x, lem.sprite.getY());
	}
	
	public void setSource(String name, String image, int w, int h) {
		LEMSprite lem = objects.get(name);
		if (lem == null) {
			return;
		}
		
		lem.texture.dispose();
		Texture texture = new Texture(Gdx.files.internal(image));
		texture.setFilter(TextureFilter.Linear, TextureFilter.Linear);
		TextureRegion region = new TextureRegion(texture, 0, 0, w, h);		
		lem.sprite.setRegion(region);
	}
	

	protected void show(String name) {
		LEMSprite lem = objects.get(name);
		if (lem == null) {
			return;
		}
		
		lem.visible = true;
	}


	protected void hide(String name) {
		LEMSprite lem = objects.get(name);
		if (lem == null) {
			return;
		}
		
		lem.visible = false;
	}
}
